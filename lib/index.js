/**
 * dsh-client-ui-wallpaper — local DSH plugin (host half).
 *
 * Serves the local Dynamic Wallpaper library (images and videos) over the
 * webserver so the browser half can paint one of them as the client
 * background. Dependency-free: this package is loaded straight from the
 * profile directory, so it may only import node: builtins.
 */
import { createReadStream } from 'node:fs';
import { execFile } from 'node:child_process';
import { appendFile, copyFile, mkdir, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, extname, join, resolve, sep } from 'node:path';

export const name = 'wallpaper';
export const inject = ['webServer'];

/** Wallpaper modes the host accepts. */
const MODE_VALUES = new Set(['image', 'rotate', 'video']);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.bmp']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.webm', '.mov', '.m4v']);
const MIME = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
};

const LIBRARY = join(homedir(), 'Library', 'Containers', 'whbalzac.Dongtaizhuomian', 'Data', 'Documents');
const DEFAULT_IMAGE_DIR = LIBRARY + '/Wallpaper';
const DEFAULT_VIDEO_DIR = LIBRARY + '/Videos';

const DEFAULT_IMAGE = '1_15488489007187.jpeg';

function clamp(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

/** Normalize the plugin config into a fixed shape. */
function normalize(raw) {
  const config = raw !== null && typeof raw === 'object' ? raw : {};
  const mode = config.mode === 'rotate' || config.mode === 'video' ? config.mode : 'image';
  return {
    imageDir: typeof config.imageDir === 'string' ? config.imageDir : DEFAULT_IMAGE_DIR,
    videoDir: typeof config.videoDir === 'string' ? config.videoDir : DEFAULT_VIDEO_DIR,
    image: typeof config.image === 'string' ? config.image : DEFAULT_IMAGE,
    only: Array.isArray(config.only) ? config.only.filter((name) => typeof name === 'string' && name.length > 0) : undefined,
    darkVideos: Array.isArray(config.darkVideos) ? config.darkVideos.filter((name) => typeof name === 'string' && name.length > 0) : [],
    video: typeof config.video === 'string' ? config.video : undefined,
    mode,
    rotateSeconds: clamp(config.rotateSeconds, 15, 86400, 600),
    panelOpacity: clamp(config.panelOpacity, 0, 1, 0.72),
    windowOpacity: clamp(config.windowOpacity, 0, 1, 0.94),
    blur: clamp(config.blur, 0, 60, 0),
    dim: clamp(config.dim, 0, 0.85, 0.15),
    autoInk: config.autoInk !== false,
    autoInclude: config.autoInclude !== false,
    position: typeof config.position === 'string' && config.position.length > 0 ? config.position : 'center',
  };
}


/** Runtime overrides written by the client slider (blur, ...). */
const STATE_FILE = join(homedir(), '.dsh', 'wallpaper-state.json');

/** Read the persisted runtime overrides, tolerating a missing or broken file. */
async function readState() {
  try {
    const parsed = JSON.parse(await readFile(STATE_FILE, 'utf8'));
    return parsed !== null && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Merge one patch into the state file, written atomically and owner-only. */
async function writeState(patch) {
  const next = { ...(await readState()), ...patch };
  await mkdir(dirname(STATE_FILE), { recursive: true });
  const temp = STATE_FILE + '.' + process.pid + '.tmp';
  await writeFile(temp, JSON.stringify(next, null, 2) + '\n', { mode: 0o600 });
  await rename(temp, STATE_FILE);
  return next;
}

/** Read a small JSON request body; undefined when it is absent or malformed. */
async function readJsonBody(req, limit = 65536) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) break;
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return undefined;
  }
}

async function listDir(dir, extensions) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const names = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name.startsWith('.')) continue;
    if (!extensions.has(extname(entry.name).toLowerCase())) continue;
    names.push(entry.name);
  }
  names.sort((a, b) => a.localeCompare(b, 'en'));
  return names;
}

/** Resolve one requested file name against a scanned directory, or undefined. */
function locate(names, dir, requested) {
  if (typeof requested !== 'string' || requested.length === 0) return undefined;
  if (requested.includes('/') || requested.includes('\\') || requested.includes('\0')) return undefined;
  if (!names.includes(requested)) return undefined;
  const base = resolve(dir);
  const target = resolve(join(base, requested));
  if (target !== base && !target.startsWith(base + sep)) return undefined;
  return target;
}

/** Stream one file, honouring a single-range request. */
/** Cached Quick Look thumbnail for one video. */
const THUMB_DIR = join(homedir(), '.dsh', 'wallpaper-thumbs');
const THUMB_TOOL = '/usr/bin/qlmanage';

async function makeThumb(source, target) {
  await mkdir(THUMB_DIR, { recursive: true });
  const scratch = join(THUMB_DIR, '.scratch-' + Date.now());
  await mkdir(scratch, { recursive: true });
  try {
    await new Promise((settle, fail) => {
      execFile(THUMB_TOOL, ['-t', '-s', '480', '-o', scratch, source], { timeout: 30000 }, (error) => (error ? fail(error) : settle()));
    });
    const produced = (await readdir(scratch)).find((entry) => entry.toLowerCase().endsWith('.png'));
    if (produced === undefined) throw new Error('thumbnail not produced');
    await rename(join(scratch, produced), target);
  } finally {
    await rm(scratch, { recursive: true, force: true }).catch(() => {});
  }
}
async function sendFile(req, res, target) {
  const info = await stat(target);
  const total = info.size;
  const type = MIME[extname(target).toLowerCase()] ?? 'application/octet-stream';
  const headers = {
    'content-type': type,
    'cache-control': 'public, max-age=3600',
    'accept-ranges': 'bytes',
  };
  let start = 0;
  let end = total - 1;
  let status = 200;
  const range = req.headers.range;
  if (typeof range === 'string') {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (match !== null) {
      if (match[1] === '' && match[2] === '') {
        res.writeHead(416, { 'content-range': 'bytes */' + total });
        res.end();
        return;
      }
      start = match[1] === '' ? Math.max(0, total - Number(match[2])) : Number(match[1]);
      if (match[2] !== '') end = Math.min(total - 1, Number(match[2]));
      if (!(start < total) || !(end >= start)) {
        res.writeHead(416, { 'content-range': 'bytes */' + total });
        res.end();
        return;
      }
      status = 206;
      headers['content-range'] = 'bytes ' + start + '-' + end + '/' + total;
    }
  }
  headers['content-length'] = String(end - start + 1);
  if (req.method === 'HEAD') {
    res.writeHead(status, headers);
    res.end();
    return;
  }
  res.writeHead(status, headers);
  createReadStream(target, { start, end }).pipe(res);
}

/**
 * Register the /wallpaper asset route.
 * @param ctx - host plugin context.
 * @param raw - plugin config.
 */
export function apply(ctx, raw) {
  const config = normalize(raw);
  let snapshot = { at: 0, images: [], videos: [] };
  const hits = { list: 0, files: 0, agents: [], recent: [], listAt: null, probeAt: null, stateReads: 0, stateWrites: 0, stateAt: null };
  let probe = null;
  let clientReport = null;
  const note = (req, kind, name) => {
    if (kind === 'list') {
      hits.list += 1;
      hits.listAt = new Date().toISOString();
    } else {
      hits.files += 1;
      if (typeof name === 'string') {
        hits.recent.push({ at: new Date().toISOString(), name });
        if (hits.recent.length > 12) hits.recent.shift();
      }
    }
    const agent = String(req.headers['user-agent'] ?? '');
    if (hits.agents.length < 8 && !hits.agents.includes(agent)) hits.agents.push(agent);
  };

  const scan = async () => {
    if (Date.now() - snapshot.at < 4000) return snapshot;
    const [images, videos] = await Promise.all([
      listDir(config.imageDir, IMAGE_EXTENSIONS),
      listDir(config.videoDir, VIDEO_EXTENSIONS),
    ]);
    snapshot = { at: Date.now(), images, videos };
    return snapshot;
  };

  /** Match each still with the animated wallpaper that shares its base name. */
  const liveMapOf = (images, videos) => {
    const byBase = new Map();
    for (const video of videos) byBase.set(video.replace(/\.[^.]+$/, ''), video);
    const pairs = {};
    for (const image of images) {
      const video = byBase.get(image.replace(/\.[^.]+$/, ''));
      if (video !== undefined) pairs[image] = video;
    }
    return pairs;
  };

  /** Narrow the rotation pool to an allow-list, when one is in force. */
  const poolOf = (images, allow) => {
    if (allow === undefined || allow.length === 0) return images;
    const chosen = images.filter((name) => allow.includes(name));
    return chosen.length > 0 ? chosen : images;
  };

  /** Files newly dropped into the folders join the rotation on their own. */
  const autoIncludeNew = async (current) => {
    try {
      const state = await readState();
      if (state.autoInclude === false) return;
      const files = current.images.concat(current.videos);
      const known = Array.isArray(state.knownFiles) ? state.knownFiles : null;
      if (known === null) {
        await writeState({ knownFiles: files.slice(0, 2000) });
        return;
      }
      const stale = Array.isArray(state.lastAdded) ? state.lastAdded.filter((name) => files.indexOf(name) >= 0) : [];
      const added = files.filter((name) => known.indexOf(name) < 0);
      const patch = { knownFiles: files.slice(0, 2000) };
      if (Array.isArray(state.lastAdded) && stale.length !== state.lastAdded.length) patch.lastAdded = stale;
      if (added.length > 0) {
        const allow = state.only === undefined ? config.only : (state.only === null ? undefined : state.only);
        const pool = poolOf(current.images, allow);
        const videoPool = Array.isArray(state.videoPool) ? state.videoPool.filter((name) => current.videos.includes(name)) : [];
        const explicit = Array.isArray(state.rotation)
          ? state.rotation.map((key) => { const cut = key.indexOf(":"); return { kind: key.slice(0, cut), name: key.slice(cut + 1) }; })
              .filter((entry) => (entry.kind === "video" ? current.videos : current.images).includes(entry.name))
          : null;
        const base = explicit !== null
          ? explicit
          : (videoPool.length > 0 ? videoPool.map((name) => ({ name, kind: "video" })) : pool.map((name) => ({ name, kind: "image" })));
        const keys = base.map((entry) => entry.kind + ":" + entry.name);
        for (const name of added) keys.push((current.videos.includes(name) ? "video:" : "image:") + name);
        patch.rotation = keys;
        patch.lastAdded = added.slice(0, 30);
        patch.lastAddedAt = Date.now();
      }
      await writeState(patch);
    } catch (error) {
      try { ctx.logger?.warn?.(error); } catch {}
    }
  };

  /** Pull every playlist entry of Dynamic Wallpaper.app into the local video folder. */
  const APP_DOCS = join(homedir(), 'Library', 'Containers', 'whbalzac.Dongtaizhuomian', 'Data', 'Documents');

  const syncFromPlaylist = async () => {
    try {
      const prefs = JSON.parse(await readFile(join(APP_DOCS, 'Setting', 'Preferences.json'), 'utf8'));
      const list = Array.isArray(prefs.playlist_array) ? prefs.playlist_array : [];
      const skip = new Set();
      try {
        const raw = await readFile(join(homedir(), '.dsh', 'wallpaper-sync-skip.txt'), 'utf8');
        for (const line of raw.split('\n')) { const name = line.trim(); if (name.length > 0 && name[0] !== '#') skip.add(name); }
      } catch {}
      await mkdir(config.videoDir, { recursive: true });
      const added = [];
      let present = 0;
      let missing = 0;
      for (const name of list) {
        if (typeof name !== 'string' || name.length === 0 || skip.has(name)) continue;
        const src = join(APP_DOCS, 'Videos', name);
        const dst = join(config.videoDir, name);
        try {
          await stat(dst);
          present += 1;
          continue;
        } catch {}
        try {
          await copyFile(src, dst);
          added.push(name);
        } catch {
          missing += 1;
        }
      }
      return { ok: true, added, present, missing, total: list.length };
    } catch (error) {
      return { ok: false, error: String(error && error.message ? error.message : error) };
    }
  };

  const handler = async (req, res) => {    try {
      if (req.method !== 'GET' && req.method !== 'HEAD' && req.method !== 'POST') {
        res.writeHead(405, { allow: 'GET, HEAD, POST' });
        res.end();
        return;
      }
      const url = new URL(req.url ?? '/', 'http://localhost');
      const pathname = decodeURIComponent(url.pathname);
      const current = await scan();
      await autoIncludeNew(current);

      if (pathname === '/wallpaper/_probe') {
        if (req.method === 'POST') {
          const chunks = [];
          let size = 0;
          for await (const chunk of req) {
            size += chunk.length;
            if (size > 262144) break;
            chunks.push(chunk);
          }
          try {
            probe = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          } catch {
            probe = { error: 'invalid probe payload' };
          }
          hits.probeAt = new Date().toISOString();
          res.writeHead(204);
          res.end();
          return;
        }
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify(probe));
        return;
      }

      if (pathname === '/wallpaper/_client') {
        if (req.method === 'POST') {
          const payload = await readJsonBody(req);
          clientReport = payload === undefined ? { error: 'invalid client payload' } : payload;
        }
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify(clientReport));
        return;
      }

      if (pathname === '/wallpaper/_hits') {
        const body = JSON.stringify({ ...hits, client: clientReport, at: new Date().toISOString() });
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(body);
        return;
      }


      if (pathname === '/wallpaper/state') {
        const state = await readState();
        const effectiveOf = (view) => ({
          blur: clamp(view.blur, 0, 60, config.blur),
          mode: MODE_VALUES.has(view.mode) ? view.mode : config.mode,
          image: typeof view.image === 'string' ? view.image : config.image,
          rotateSeconds: clamp(view.rotateSeconds, 15, 86400, config.rotateSeconds),
          only: view.only === undefined ? (config.only ?? null) : view.only,
          video: typeof view.video === 'string' ? view.video : config.video,
          videoPool: Array.isArray(view.videoPool) ? view.videoPool : [],
          rotation: Array.isArray(view.rotation) ? view.rotation : null,
          autoInk: view.autoInk === undefined ? config.autoInk : view.autoInk === true,
          autoInclude: view.autoInclude === undefined ? config.autoInclude !== false : view.autoInclude === true,
          sidebarOpacity: view.sidebarOpacity === undefined ? (config.sidebarOpacity === undefined ? null : config.sidebarOpacity) : view.sidebarOpacity,
          knownCount: Array.isArray(view.knownFiles) ? view.knownFiles.length : 0,
          lastAdded: Array.isArray(view.lastAdded) ? view.lastAdded : [],
          live: view.live === true,
        });
        const effective = () => effectiveOf(state);
        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          if (body === undefined || body === null || typeof body !== 'object' || Array.isArray(body)) {
            res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
            res.end(JSON.stringify({ error: 'body must be a JSON object' }));
            return;
          }
          const patch = {};
          if (body.blur !== undefined) {
            const blur = Number(body.blur);
            if (!Number.isFinite(blur)) {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'blur must be a number' }));
              return;
            }
            patch.blur = clamp(blur, 0, 60, config.blur);
          }
          if (body.image !== undefined) {
            if (typeof body.image !== 'string' || !current.images.includes(body.image)) {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'image must be one of the scanned file names' }));
              return;
            }
            patch.image = body.image;
          }
          if (body.mode !== undefined) {
            if (!MODE_VALUES.has(body.mode)) {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'mode must be image, rotate or video' }));
              return;
            }
            patch.mode = body.mode;
          }
          if (body.rotateSeconds !== undefined) {
            const seconds = Number(body.rotateSeconds);
            if (!Number.isFinite(seconds)) {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'rotateSeconds must be a number' }));
              return;
            }
            patch.rotateSeconds = clamp(seconds, 15, 86400, config.rotateSeconds);
          }
          if (body.only !== undefined) {
            if (body.only === null) patch.only = null;
            else if (Array.isArray(body.only) && body.only.every((name) => typeof name === 'string')) {
              patch.only = body.only.filter((name) => current.images.includes(name));
            } else {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'only must be null or an array of image names' }));
              return;
            }
          }
          if (body.autoInk !== undefined) {
            if (typeof body.autoInk !== 'boolean') {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'autoInk must be a boolean' }));
              return;
            }
            patch.autoInk = body.autoInk;
          }
          if (body.sidebarOpacity !== undefined) {
            if (body.sidebarOpacity === null) patch.sidebarOpacity = null;
            else if (typeof body.sidebarOpacity === 'number' && isFinite(body.sidebarOpacity) && body.sidebarOpacity >= 0 && body.sidebarOpacity <= 1) patch.sidebarOpacity = body.sidebarOpacity;
            else {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'sidebarOpacity must be null or a number between 0 and 1' }));
              return;
            }
          }
          if (body.autoInclude !== undefined) {
            if (typeof body.autoInclude !== "boolean") {
              res.writeHead(400, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
              res.end(JSON.stringify({ error: "autoInclude must be a boolean" }));
              return;
            }
            patch.autoInclude = body.autoInclude;
          }
          if (body.rotation !== undefined) {
            if (body.rotation === null) patch.rotation = null;
            else if (Array.isArray(body.rotation) && body.rotation.every((key) => typeof key === 'string')) {
              patch.rotation = body.rotation.filter((key) => {
                const cut = key.indexOf(':');
                if (cut <= 0) return false;
                const kind = key.slice(0, cut);
                const name = key.slice(cut + 1);
                return kind === 'video' ? current.videos.includes(name) : (kind === 'image' && current.images.includes(name));
              });
            } else {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'rotation must be null or an array of kind:name keys' }));
              return;
            }
          }
          if (body.videoPool !== undefined) {
            if (body.videoPool === null) patch.videoPool = null;
            else if (Array.isArray(body.videoPool) && body.videoPool.every((name) => typeof name === 'string')) {
              patch.videoPool = body.videoPool.filter((name) => current.videos.includes(name));
            } else {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'videoPool must be null or an array of video names' }));
              return;
            }
          }
          if (body.video !== undefined) {
            if (body.video !== null && (typeof body.video !== 'string' || !current.videos.includes(body.video))) {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'video must be null or one of the scanned file names' }));
              return;
            }
            patch.video = body.video;
          }
          if (body.live !== undefined) {
            if (typeof body.live !== 'boolean') {
              res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
              res.end(JSON.stringify({ error: 'live must be a boolean' }));
              return;
            }
            patch.live = body.live;
          }
          await writeState(patch);
          hits.stateWrites += 1;
          hits.stateAt = new Date().toISOString();
          res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
          res.end(JSON.stringify(effectiveOf({ ...state, ...patch })));
          return;
        }
        hits.stateReads += 1;
        hits.stateAt = new Date().toISOString();
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify(effective()));
        return;
      }

      if (pathname === '/wallpaper/list.json') {        note(req, 'list');
        const state = await readState();
        const mode = MODE_VALUES.has(state.mode) ? state.mode : config.mode;
        const allow = state.only === undefined ? config.only : (state.only === null ? undefined : state.only);
        const pool = poolOf(current.images, allow);
        const videoPool = Array.isArray(state.videoPool) ? state.videoPool.filter((name) => current.videos.includes(name)) : [];
        const explicit = Array.isArray(state.rotation)
          ? state.rotation.map((key) => { const cut = key.indexOf(':'); return { kind: key.slice(0, cut), name: key.slice(cut + 1) }; })
              .filter((entry) => (entry.kind === 'video' ? current.videos : current.images).includes(entry.name))
          : null;
        const sequence = mode !== 'rotate' ? []
          : (explicit !== null
            ? explicit
            : (videoPool.length > 0 ? videoPool.map((name) => ({ name, kind: 'video' })) : pool.map((name) => ({ name, kind: 'image' }))));
        const wanted = typeof state.image === 'string' && current.images.includes(state.image) ? state.image : config.image;
        const image = mode === 'rotate'
          ? (pool.includes(wanted) ? wanted : pool[0])
          : (current.images.includes(wanted) ? wanted : current.images[0]);
        const body = JSON.stringify({
          images: mode === 'rotate' ? pool : current.images,
          videos: current.videos,
          library: current.images,
          pool,
          darkPool: config.only ?? [],
          liveMap: liveMapOf(current.images, current.videos),
          sequence,
          videoPool,
          darkVideos: config.darkVideos,
          rotation: Array.isArray(state.rotation) ? state.rotation : null,
          config: {
            mode,
            image,
            video: typeof state.video === 'string' ? state.video : config.video,
            live: state.live === true,
            autoInk: state.autoInk === undefined ? config.autoInk : state.autoInk === true,
            rotateSeconds: clamp(state.rotateSeconds, 15, 86400, config.rotateSeconds),
            panelOpacity: config.panelOpacity,
            sidebarOpacity: config.sidebarOpacity === undefined ? null : config.sidebarOpacity,
            windowOpacity: config.windowOpacity,
            blur: config.blur,
            dim: config.dim,
            position: config.position,
          },
        });
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(body);
        return;
      }

      if (pathname === '/wallpaper/delete' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const kind = body && body.kind === 'video' ? 'video' : (body && body.kind === 'image' ? 'image' : undefined);
        const name = body && typeof body.name === 'string' ? body.name : undefined;
        if (kind === undefined || name === undefined) {
          res.writeHead(400, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
          res.end(JSON.stringify({ error: 'kind must be image or video, and name must be a string' }));
          return;
        }
        const pool = kind === 'video' ? current.videos : current.images;
        const dir = kind === 'video' ? config.videoDir : config.imageDir;
        const target = locate(pool, dir, name);
        if (target === undefined) {
          res.writeHead(404, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
          res.end(JSON.stringify({ error: 'file not found' }));
          return;
        }
        await rm(target, { force: true });
        if (kind === 'video') await rm(join(THUMB_DIR, name + '.png'), { force: true }).catch(() => {});
        try {
          await appendFile(join(homedir(), '.dsh', 'wallpaper-sync-skip.txt'), name + '\n', 'utf8');
        } catch {}
        const state = await readState();
        if (Array.isArray(state.rotation)) {
          const keep = state.rotation.filter((key) => key !== kind + ':' + name);
          if (keep.length !== state.rotation.length) await writeState({ rotation: keep });
        }
        hits.deletes = (hits.deletes || 0) + 1;
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify({ ok: true, removed: name, kind }));
        return;
      }

      if (pathname === '/wallpaper/sync' && req.method === 'POST') {
        note(req, 'sync');
        const result = await syncFromPlaylist();
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        res.end(JSON.stringify(result));
        return;
      }

      if (pathname.startsWith('/wallpaper/thumb/')) {
        const requested = pathname.slice('/wallpaper/thumb/'.length);
        note(req, 'thumb', requested);
        const video = locate(current.videos, config.videoDir, requested);
        if (video === undefined) {
          res.writeHead(404);
          res.end();
          return;
        }
        const thumb = join(THUMB_DIR, requested + '.png');
        try {
          await stat(thumb);
        } catch {
          await makeThumb(video, thumb);
        }
        await sendFile(req, res, thumb);
        return;
      }
      if (pathname.startsWith('/wallpaper/file/')) {
        const requested = pathname.slice('/wallpaper/file/'.length);
        note(req, 'file', requested);
        const target = locate(current.images, config.imageDir, requested)
          ?? locate(current.videos, config.videoDir, requested);
        if (target === undefined) {
          res.writeHead(404);
          res.end();
          return;
        }
        await sendFile(req, res, target);
        return;
      }

      res.writeHead(404);
      res.end();
    } catch (error) {
      try {
        ctx.logger?.warn?.(error);
      } catch {}
      if (!res.headersSent) res.writeHead(500);
      res.end();
    }
  };

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/wallpaper', handler }), 'wallpaper: asset route');
}