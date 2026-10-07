// Headless Chrome over the DevTools protocol, with Node built-ins only
// (child_process + the global WebSocket in Node 22). One launch serves a whole
// job: every slide, every spec and the PDF go through the same browser.

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function findChrome(explicit) {
  const local = process.env.LOCALAPPDATA;
  const candidates = [
    explicit,
    process.env.SOCIAL_RENDER_CHROME,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    local && path.join(local, 'Google', 'Chrome', 'Application', 'chrome.exe'),
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  if (explicit && !existsSync(explicit)) throw new Error(`Chrome not found at ${explicit}`);
  return candidates.find((c) => c && existsSync(c)) ?? null;
}

// --disable-gpu: repeatable pixels (with the GPU, blurred areas varied between runs).
// The rest keep a throwaway headless profile quiet and off the network.
const FLAGS = [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--force-color-profile=srgb',
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-extensions',
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-default-apps',
  '--disable-sync',
  '--disable-domain-reliability',
  '--disable-client-side-phishing-detection',
  '--no-pings',
  '--mute-audio',
  '--log-level=3',
  '--remote-debugging-port=0',
];

export async function launchChrome({ chromePath, profileDir, timeoutMs = 30_000 }) {
  await fs.mkdir(profileDir, { recursive: true });
  const portFile = path.join(profileDir, 'DevToolsActivePort');
  await fs.rm(portFile, { force: true });
  const proc = spawn(chromePath, [...FLAGS, `--user-data-dir=${profileDir}`, 'about:blank'], {
    stdio: 'ignore',
    windowsHide: true,
  });
  let exitCode = null;
  let spawnError = null;
  const exited = new Promise((resolve) => proc.once('exit', (code) => resolve((exitCode = code ?? -1))));
  proc.once('error', (e) => (spawnError = e));

  let port;
  let wsPath;
  const deadline = Date.now() + timeoutMs;
  while (!wsPath) {
    if (spawnError) throw new Error(`Could not start Chrome: ${spawnError.message}`);
    if (exitCode !== null) {
      throw new Error(`Chrome exited (code ${exitCode}) before it was ready. Code 21 means another Chrome is using the profile folder.`);
    }
    if (Date.now() > deadline) {
      proc.kill();
      throw new Error('Chrome did not open its DevTools port in time');
    }
    try {
      const [p, w] = (await fs.readFile(portFile, 'utf8')).trim().split(/\r?\n/);
      if (/^\d+$/.test(p ?? '') && (w ?? '').startsWith('/devtools/browser/')) [port, wsPath] = [p, w];
    } catch {}
    if (!wsPath) await sleep(100);
  }

  const ws = new WebSocket(`ws://127.0.0.1:${port}${wsPath}`);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error('Could not connect to Chrome DevTools'));
  });
  return new Browser(ws, proc, exited);
}

class Browser {
  #ws;
  #proc;
  #exited;
  #seq = 0;
  #pending = new Map();
  #listeners = new Set();

  constructor(ws, proc, exited) {
    this.#ws = ws;
    this.#proc = proc;
    this.#exited = exited;
    ws.onmessage = ({ data }) => {
      const msg = JSON.parse(typeof data === 'string' ? data : data.toString());
      if (msg.id !== undefined && this.#pending.has(msg.id)) {
        const { resolve, reject, method } = this.#pending.get(msg.id);
        this.#pending.delete(msg.id);
        if (msg.error) reject(new Error(`${method}: ${msg.error.message}${msg.error.data ? ` (${msg.error.data})` : ''}`));
        else resolve(msg.result);
      } else if (msg.method) {
        for (const l of [...this.#listeners]) l(msg);
      }
    };
    ws.onclose = () => {
      for (const { reject, method } of this.#pending.values()) reject(new Error(`${method}: Chrome closed the connection`));
      this.#pending.clear();
    };
  }

  send(method, params = {}, sessionId, timeoutMs = 60_000) {
    return new Promise((resolve, reject) => {
      const id = ++this.#seq;
      const timer = setTimeout(() => {
        if (this.#pending.delete(id)) reject(new Error(`${method}: no answer from Chrome in ${timeoutMs / 1000} s`));
      }, timeoutMs);
      this.#pending.set(id, {
        method,
        resolve: (v) => (clearTimeout(timer), resolve(v)),
        reject: (e) => (clearTimeout(timer), reject(e)),
      });
      this.#ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  /** Resolves with the first event `method` on `sessionId`. Register before triggering it. */
  waitFor(method, sessionId, timeoutMs = 60_000) {
    let listener;
    const promise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#listeners.delete(listener);
        reject(new Error(`${method}: not received in ${timeoutMs / 1000} s`));
      }, timeoutMs);
      listener = (m) => {
        if (m.method === method && m.sessionId === sessionId) {
          clearTimeout(timer);
          this.#listeners.delete(listener);
          resolve(m.params);
        }
      };
      this.#listeners.add(listener);
    });
    return promise;
  }

  on(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  async newPage({ width, height }) {
    const { targetId } = await this.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await this.send('Target.attachToTarget', { targetId, flatten: true });
    const page = new Page(this, targetId, sessionId);
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
    return page;
  }

  async close() {
    try {
      await this.send('Browser.close', {}, undefined, 10_000);
    } catch {}
    const done = await Promise.race([this.#exited.then(() => true), sleep(10_000).then(() => false)]);
    if (!done) {
      this.#proc.kill();
      await Promise.race([this.#exited, sleep(5_000)]);
    }
    try {
      this.#ws.close();
    } catch {}
  }
}

class Page {
  constructor(browser, targetId, sessionId) {
    this.browser = browser;
    this.targetId = targetId;
    this.sessionId = sessionId;
    this.errors = [];
    this.off = browser.on((m) => {
      if (m.sessionId !== sessionId) return;
      if (m.method === 'Runtime.exceptionThrown') {
        const d = m.params.exceptionDetails;
        this.errors.push(d.exception?.description ?? d.text);
      } else if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') {
        this.errors.push(m.params.args.map((a) => a.value ?? a.description).join(' '));
      }
    });
  }

  send(method, params = {}, timeoutMs) {
    return this.browser.send(method, params, this.sessionId, timeoutMs);
  }

  async navigate(url) {
    const loaded = this.browser.waitFor('Page.loadEventFired', this.sessionId);
    const r = await this.send('Page.navigate', { url });
    if (r.errorText) throw new Error(`Could not open ${url}: ${r.errorText}`);
    await loaded;
  }

  async evaluate(expression, timeoutMs) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, timeoutMs);
    if (r.exceptionDetails) {
      const d = r.exceptionDetails;
      throw new Error(`page script failed: ${d.exception?.description ?? d.text}`);
    }
    return r.result.value;
  }

  async screenshot({ width, height }) {
    const { data } = await this.send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width, height, scale: 1 },
      fromSurface: true,
      captureBeyondViewport: false,
    });
    return Buffer.from(data, 'base64');
  }

  async pdf() {
    const { data } = await this.send('Page.printToPDF', {
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      marginTop: 0,
      marginBottom: 0,
      marginLeft: 0,
      marginRight: 0,
      generateDocumentOutline: false,
    }, 120_000);
    return Buffer.from(data, 'base64');
  }

  async close() {
    this.off();
    await this.browser.send('Target.closeTarget', { targetId: this.targetId }).catch(() => {});
  }
}
