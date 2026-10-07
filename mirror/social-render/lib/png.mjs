// Reads a PNG's size from its IHDR chunk, so every render can be checked
// against the exact canvas it was meant to have.

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

export function pngInfo(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 33 || !buf.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error('not a PNG file');
  }
  if (buf.toString('latin1', 12, 16) !== 'IHDR') throw new Error('PNG has no IHDR chunk first');
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    bitDepth: buf[24],
    colorType: buf[25], // 2 = RGB, 6 = RGBA
  };
}
