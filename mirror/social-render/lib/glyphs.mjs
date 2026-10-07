// Which characters can the bundled fonts draw? Reads the cmap table straight
// out of the WOFF2 files (Node's built-in brotli), so a character the fonts
// lack is refused before render instead of silently falling back to Arial or
// Times New Roman, as the arrow did in the feasibility test.

import fs from 'node:fs';
import zlib from 'node:zlib';

const KNOWN_TAGS = ['cmap', 'head', 'hhea', 'hmtx', 'maxp', 'name', 'OS/2', 'post', 'cvt ', 'fpgm', 'glyf', 'loca', 'prep', 'CFF ', 'VORG', 'EBDT', 'EBLC', 'gasp', 'hdmx', 'kern', 'LTSH', 'PCLT', 'VDMX', 'vhea', 'vmtx', 'BASE', 'GDEF', 'GPOS', 'GSUB', 'EBSC', 'JSTF', 'MATH', 'CBDT', 'CBLC', 'COLR', 'CPAL', 'SVG ', 'sbix', 'acnt', 'avar', 'bdat', 'bloc', 'bsln', 'cvar', 'fdsc', 'feat', 'fmtx', 'fvar', 'gvar', 'hsty', 'just', 'lcar', 'mort', 'morx', 'opbd', 'prop', 'trak', 'Zapf', 'Silf', 'Glat', 'Gloc', 'Feat', 'Sill'];

function base128(buf, pos) {
  let v = 0;
  for (let i = 0; i < 5; i++) {
    const b = buf[pos.p++];
    v = (v << 7) | (b & 0x7f);
    if (!(b & 0x80)) return v >>> 0;
  }
  throw new Error('bad UIntBase128');
}

function woff2Table(buf, want) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file');
  const numTables = buf.readUInt16BE(12);
  const compressed = buf.readUInt32BE(20);
  const pos = { p: 48 };
  const dir = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[pos.p++];
    const idx = flags & 63;
    const xform = flags >> 6;
    let tag;
    if (idx === 63) {
      tag = buf.toString('latin1', pos.p, pos.p + 4);
      pos.p += 4;
    } else tag = KNOWN_TAGS[idx];
    const origLength = base128(buf, pos);
    const transformed = tag === 'glyf' || tag === 'loca' ? xform !== 3 : xform !== 0;
    dir.push({ tag, length: transformed ? base128(buf, pos) : origLength });
  }
  const data = zlib.brotliDecompressSync(buf.subarray(pos.p, pos.p + compressed));
  let off = 0;
  for (const t of dir) {
    if (t.tag === want) return data.subarray(off, off + t.length);
    off += t.length;
  }
  return null;
}

function cmapCodepoints(t, into) {
  const n = t.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const off = t.readUInt32BE(4 + i * 8 + 4);
    const format = t.readUInt16BE(off);
    if (format === 4) {
      const segX2 = t.readUInt16BE(off + 6);
      const ends = off + 14;
      const starts = ends + segX2 + 2;
      const deltas = starts + segX2;
      const ranges = deltas + segX2;
      for (let s = 0; s < segX2 / 2; s++) {
        const end = t.readUInt16BE(ends + s * 2);
        const start = t.readUInt16BE(starts + s * 2);
        const delta = t.readInt16BE(deltas + s * 2);
        const rangeOff = t.readUInt16BE(ranges + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let g;
          if (rangeOff === 0) g = (c + delta) & 0xffff;
          else {
            g = t.readUInt16BE(ranges + s * 2 + rangeOff + (c - start) * 2);
            if (g) g = (g + delta) & 0xffff;
          }
          if (g) into.add(c);
        }
      }
    } else if (format === 12) {
      const groups = t.readUInt32BE(off + 12);
      for (let g = 0; g < groups; g++) {
        const o = off + 16 + g * 12;
        for (let c = t.readUInt32BE(o); c <= t.readUInt32BE(o + 4); c++) into.add(c);
      }
    }
  }
  return into;
}

/** Code points every listed font family can draw (intersection across families, union within one). */
export function coveredCodepoints(families) {
  let result = null;
  for (const files of families) {
    const set = new Set();
    for (const file of files) {
      const cmap = woff2Table(fs.readFileSync(file), 'cmap');
      if (cmap) cmapCodepoints(cmap, set);
    }
    result = result === null ? set : new Set([...result].filter((c) => set.has(c)));
  }
  // Ordinary whitespace is laid out by the browser even without a glyph.
  for (const c of [0x20, 0x0a, 0xa0]) result?.add(c);
  return result ?? new Set();
}
