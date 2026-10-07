// Runs inside the rendered page. render.mjs calls, in order:
//   __sr.ready()   force-load every font face, wait for document.fonts.ready and two frames
//   __sr.fit(opts) shrink type only where content would not fit, give each series one
//                  scale and one position, then report problems per slide
//   __sr.show(n)   show only slide n at the top of the page, for its screenshot
(() => {
  const TOL = 1.5;
  // Text that must stay at least opts.minBodyPx tall (the spec's minimum body size).
  const BODY_ROLE = '.body, .lead, .quote, .tile-label, .tile-sub, .check-text, .step, .note, .takeaway';
  // Content block position in the free space below the header: 0 top, 1 bottom.
  const BIAS = { cover: 1, point: 0.44, data: 0.4, quote: 0.46, checklist: 0.42, flow: 0.4, closing: 0.44 };

  const frames = (n) => new Promise((done) => {
    const step = (k) => (k <= 0 ? done() : requestAnimationFrame(() => step(k - 1)));
    step(n);
  });
  const snippet = (t) => t.replace(/\s+/g, ' ').trim().slice(0, 48);
  const slides = () => [...document.querySelectorAll('.slide')];
  const typeOf = (slide) => [...slide.classList].find((c) => c.startsWith('t-')).slice(2);

  function textRects(root) {
    const out = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const rect of range.getClientRects()) if (rect.width > 0.5 && rect.height > 0.5) out.push({ rect, node: n });
    }
    return out;
  }

  const outside = (r, b, m = 0) =>
    r.left < b.left + m - TOL || r.right > b.right - m + TOL || r.top < b.top + m - TOL || r.bottom > b.bottom - m + TOL;

  function problems(slide) {
    const issues = [];
    const main = slide.querySelector('.main');
    const mb = main.getBoundingClientRect();
    const sb = slide.getBoundingClientRect();
    for (const { rect, node } of textRects(main)) {
      const hang = node.parentElement.closest('.qm-open');
      if (hang ? outside(rect, sb, 40) : outside(rect, mb)) issues.push(`text outside the content area: "${snippet(node.textContent)}"`);
    }
    for (const el of main.querySelectorAll('.glass, .chip, .shape, .flow-arrow, .arrow')) {
      if (outside(el.getBoundingClientRect(), mb)) issues.push(`a ${String(el.getAttribute('class')).split(' ')[0]} box is outside the content area`);
    }
    for (const el of main.querySelectorAll('h1, h2, p, blockquote, li, .step, .tile-value, .tile-label, .tile-sub, .check-text')) {
      if (el.scrollWidth > el.clientWidth + TOL) issues.push(`a word is wider than its box: "${snippet(el.textContent)}"`);
    }
    for (const { rect, node } of textRects(slide.querySelector('.top'))) {
      if (outside(rect, sb, 40)) issues.push(`header text too close to the edge: "${snippet(node.textContent)}"`);
    }
    return issues;
  }

  function fontStats(slide) {
    let minBody = Infinity;
    let minAny = Infinity;
    for (const { node } of textRects(slide)) {
      const el = node.parentElement;
      const px = parseFloat(getComputedStyle(el).fontSize);
      minAny = Math.min(minAny, px);
      if (el.closest(BODY_ROLE)) minBody = Math.min(minBody, px);
    }
    return { minBody: Number.isFinite(minBody) ? minBody : null, minAny: Number.isFinite(minAny) ? minAny : null };
  }

  const setK = (slide, kh, kb) => {
    slide.style.setProperty('--kh', kh.toFixed(3));
    slide.style.setProperty('--kb', kb.toFixed(3));
  };

  function hangQuotes() {
    for (const q of document.querySelectorAll('.qm-open')) {
      q.style.marginLeft = '0';
      const em = q.getBoundingClientRect().width / parseFloat(getComputedStyle(q).fontSize);
      q.style.marginLeft = `-${em.toFixed(4)}em`;
    }
  }

  // ------------------------------------------------------------------
  // Decorative ribbons and orbs never cross text. Each one is sampled as
  // its true shape (a rotated ellipse outline, or a disc), and moved
  // vertically by the smallest step that clears every text line, glass box
  // and the header; if no position clears, it is hidden.
  const CLEAR = 30;
  function keepOut(slide) {
    const sb = slide.getBoundingClientRect();
    const rects = [];
    const add = (r) => r.width > 0 && r.height > 0 && rects.push({ l: r.left - CLEAR, r: r.right + CLEAR, t: r.top - CLEAR, b: r.bottom + CLEAR });
    for (const { rect } of textRects(slide.querySelector('.frame'))) add(rect);
    for (const el of slide.querySelectorAll('.glass, .chip, .shape, .flow-arrow, .brand-mark')) add(el.getBoundingClientRect());
    // The byline and counter must not sit inside a ribbon either, only beside it.
    const header = [];
    for (const { rect } of textRects(slide.querySelector('.top'))) header.push(rect);
    for (const el of slide.querySelectorAll('.top .brand-mark')) header.push(el.getBoundingClientRect());
    return { sb, rects, header };
  }
  const hit = (x, y, rects) => rects.some((q) => x >= q.l && x <= q.r && y >= q.t && y <= q.b);
  function insideEllipse(el, sb, dy, rects) {
    const w = el.offsetWidth / 2;
    const h = el.offsetHeight / 2;
    const cx = sb.left + el.offsetLeft + w;
    const cy = sb.top + el.offsetTop + h + dy;
    const t = getComputedStyle(el).transform;
    const inv = new DOMMatrix(t === 'none' ? undefined : t).inverse();
    return rects.some((r) => [[r.left, r.top], [r.right, r.top], [r.left, r.bottom], [r.right, r.bottom], [(r.left + r.right) / 2, (r.top + r.bottom) / 2]]
      .some(([x, y]) => {
        const p = inv.transformPoint({ x: x - cx, y: y - cy });
        return (p.x / w) ** 2 + (p.y / h) ** 2 <= 1;
      }));
  }
  function shapeOf(el, sb) {
    el.style.translate = '0px 0px';
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const cx = sb.left + el.offsetLeft + w / 2;
    const cy = sb.top + el.offsetTop + h / 2;
    const m = new DOMMatrixReadOnly(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform);
    const disc = !el.classList.contains('ribbon');
    const pts = [];
    if (disc) {
      // the whole disc: centre, rings at half and full radius
      const r = w / 2;
      pts.push([cx, cy]);
      for (let k = 0; k < 48; k++) {
        const t = (k / 48) * Math.PI * 2;
        pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)], [cx + 0.5 * r * Math.cos(t), cy + 0.5 * r * Math.sin(t)]);
      }
    } else {
      for (let k = 0; k < 240; k++) {
        const t = (k / 240) * Math.PI * 2;
        const x = (w / 2) * Math.cos(t);
        const y = (h / 2) * Math.sin(t);
        pts.push([cx + m.a * x + m.c * y, cy + m.b * x + m.d * y]);
      }
    }
    return pts;
  }
  function avoidText(all) {
    const moves = [];
    all.forEach((slide, i) => {
      const { sb, rects, header } = keepOut(slide);
      for (const el of slide.querySelectorAll('.atmos > .ribbon, .atmos > .orb, .atmos > .story-orb')) {
        el.style.display = '';
        const pts = shapeOf(el, sb);
        const ribbon = el.classList.contains('ribbon');
        const inside = (dy) => pts.filter(([x, y]) => x >= sb.left && x <= sb.right && y + dy >= sb.top && y + dy <= sb.bottom);
        const visibleAt0 = inside(0).length;
        let chosen = null;
        for (let step = 0; step <= 40 && chosen === null; step++) {
          for (const dy of step === 0 ? [0] : [step * 24, -step * 24]) {
            const vis = inside(dy);
            if (vis.length < Math.max(6, visibleAt0 * 0.6)) continue;
            if (ribbon && insideEllipse(el, sb, dy, header)) continue;
            if (!vis.some(([x, y]) => hit(x, y + dy, rects))) {
              chosen = dy;
              break;
            }
          }
        }
        const name = String(el.getAttribute('class')).split(' ')[0];
        if (chosen === null) {
          el.style.display = 'none';
          moves.push({ n: i + 1, el: name, hidden: true });
        } else {
          el.style.translate = `0px ${chosen}px`;
          if (chosen) moves.push({ n: i + 1, el: name, dy: chosen });
        }
      }
    });
    return moves;
  }

  function place(all, groups) {
    const info = all.map((slide) => {
      const main = slide.querySelector('.main');
      const stack = slide.querySelector('.stack');
      stack.style.marginTop = '0px';
      const cs = getComputedStyle(main);
      const inner = main.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      return { stack, inner, h: stack.getBoundingClientRect().height, type: typeOf(slide) };
    });
    // A series keeps its headline at the same height on every slide.
    for (const idx of groups.values()) {
      const h = Math.max(...idx.map((i) => info[i].h));
      for (const i of idx) info[i].h = h;
    }
    for (const it of info) {
      const free = Math.max(0, it.inner - it.h);
      it.stack.style.marginTop = `${Math.round(free * (BIAS[it.type] ?? 0.4))}px`;
    }
  }

  window.__sr = {
    async ready() {
      const faces = [...document.fonts];
      const settled = await Promise.allSettled(faces.map((f) => f.load()));
      await document.fonts.ready;
      await frames(2);
      return faces.map((f, i) => ({
        family: f.family.replace(/["']/g, ''),
        weight: f.weight,
        status: f.status,
        error: settled[i].status === 'rejected' ? String(settled[i].reason) : null,
      }));
    },

    fit(opts) {
      hangQuotes();
      const all = slides();
      const res = all.map((slide) => {
        setK(slide, 1, 1);
        const start = fontStats(slide).minBody;
        const kbMin = start ? Math.min(1, opts.minBodyPx / start) : 1;
        let kh = 1;
        let kb = 1;
        while (problems(slide).length && kh > opts.khMin + 1e-6) setK(slide, (kh = Math.max(opts.khMin, kh - 0.02)), kb);
        while (problems(slide).length && kb > kbMin + 1e-6) setK(slide, kh, (kb = Math.max(kbMin, kb - 0.02)));
        return { kh, kb };
      });
      const groups = new Map();
      all.forEach((s, i) => {
        const g = s.dataset.series;
        if (g) groups.set(g, [...(groups.get(g) ?? []), i]);
      });
      for (const idx of groups.values()) {
        const kh = Math.min(...idx.map((i) => res[i].kh));
        const kb = Math.min(...idx.map((i) => res[i].kb));
        for (const i of idx) {
          res[i] = { kh, kb };
          setK(all[i], kh, kb);
        }
      }
      place(all, groups);
      const moves = avoidText(all);
      return all.map((slide, i) => {
        const fonts = fontStats(slide);
        const issues = problems(slide);
        if (fonts.minBody !== null && fonts.minBody < opts.minBodyPx - 0.01) issues.push(`body text is ${fonts.minBody.toFixed(1)} px, under the ${opts.minBodyPx} px minimum`);
        if (fonts.minAny !== null && fonts.minAny < opts.minAnyPx - 0.01) issues.push(`some text is ${fonts.minAny.toFixed(1)} px, under the ${opts.minAnyPx} px floor`);
        return {
          n: i + 1,
          type: typeOf(slide),
          series: slide.dataset.series ?? null,
          kh: res[i].kh,
          kb: res[i].kb,
          minBodyPx: fonts.minBody,
          minTextPx: fonts.minAny,
          gradients: [...slide.querySelectorAll('.g')].map((e) => e.textContent),
          headlineTop: Math.round((slide.querySelector('.headline, .display, .quote')?.getBoundingClientRect().top ?? 0) - slide.getBoundingClientRect().top),
          atmosphere: moves.filter((m) => m.n === i + 1).map(({ n, ...m }) => m),
          problems: issues,
        };
      });
    },

    async show(n) {
      slides().forEach((s, i) => (s.style.display = i + 1 === n ? '' : 'none'));
      window.scrollTo(0, 0);
      await frames(2);
      return true;
    },
  };
})();
