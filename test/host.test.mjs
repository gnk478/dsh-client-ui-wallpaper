#!/usr/bin/env node
/**
 * 行为测试：用 mock ctx（只实现 effect / webServer.register / logger）把宿主路由
 * 挂到一个真实 http 服务上，跑关键路径。零依赖，只用 node:test。
 *
 * 注意：HOME 必须在 import 宿主之前改写 —— STATE_FILE / THUMB_DIR / .Trash
 * 都是模块加载时按 homedir() 定下来的。
 */
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const HOME = mkdtempSync(path.join(os.tmpdir(), 'dsh-wp-test-'));
process.env.HOME = HOME;

const IMAGES = path.join(HOME, 'images');
const VIDEOS = path.join(HOME, 'videos');
const THUMBS = path.join(HOME, '.dsh', 'wallpaper-thumbs');
const TRASH = path.join(HOME, '.Trash');

mkdirSync(IMAGES, { recursive: true });
mkdirSync(VIDEOS, { recursive: true });
mkdirSync(THUMBS, { recursive: true });
writeFileSync(path.join(IMAGES, 'a.png'), Buffer.alloc(2048, 7));
writeFileSync(path.join(IMAGES, 'victim.png'), Buffer.alloc(512, 3));
writeFileSync(path.join(IMAGES, 'victim2.png'), Buffer.alloc(128, 5));
writeFileSync(path.join(VIDEOS, 'clip.mp4'), Buffer.alloc(4096, 9));
// 缩略图缓存：孤儿 .png、有效 .png、陈旧 .scratch-*、新建 .scratch-*
writeFileSync(path.join(THUMBS, 'orphan.mp4.png'), Buffer.alloc(64, 1));
writeFileSync(path.join(THUMBS, 'clip.mp4.png'), Buffer.alloc(64, 2));
const past = new Date(Date.now() - 3 * 60 * 60 * 1000);
mkdirSync(path.join(THUMBS, '.scratch-100'));
writeFileSync(path.join(THUMBS, '.scratch-100', 'x.png'), Buffer.alloc(8, 4));
const { utimesSync } = await import('node:fs');
utimesSync(path.join(THUMBS, '.scratch-100'), past, past);
mkdirSync(path.join(THUMBS, '.scratch-200'));

let base;
let server;
const json = (body) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

before(async () => {
  const mod = await import('../lib/index.js');
  let route = null;
  const ctx = {
    effect: (fn) => { fn(); return () => {}; },
    webServer: { register: (registered) => { route = registered; return () => {}; } },
    logger: { warn: () => {} },
  };
  mod.apply(ctx, { imageDir: IMAGES, videoDir: VIDEOS });
  assert.ok(route !== null, '宿主应注册 /wallpaper 路由');
  server = http.createServer((req, res) => route.handler(req, res));
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = 'http://127.0.0.1:' + server.address().port + '/wallpaper';
});

after(() => new Promise((resolve) => { server.closeAllConnections?.(); server.close(resolve); }));

test('list.json 列出素材与配置', async () => {
  const response = await fetch(base + '/list.json');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.ok(body.images.includes('a.png'));
  assert.ok(body.videos.includes('clip.mp4'));
  assert.equal(body.config.shuffle, false);
  assert.equal(body.config.mode, 'image');
  assert.ok(Array.isArray(body.sequence));
});

test('state 校验：非法值 400，shuffle 往返真实生效', async () => {
  const badBlur = await fetch(base + '/state', json({ blur: 'x' }));
  assert.equal(badBlur.status, 400);

  const badBody = await fetch(base + '/state', json([1, 2]));
  assert.equal(badBody.status, 400);

  const badShuffle = await fetch(base + '/state', json({ shuffle: 'yes' }));
  assert.equal(badShuffle.status, 400);
  assert.equal((await badShuffle.json()).error, 'shuffle must be a boolean');

  const on = await fetch(base + '/state', json({ shuffle: true }));
  assert.equal(on.status, 200);
  assert.equal((await on.json()).shuffle, true);
  const list = await (await fetch(base + '/list.json')).json();
  assert.equal(list.config.shuffle, true);

  const off = await fetch(base + '/state', json({ shuffle: false }));
  assert.equal((await off.json()).shuffle, false);
  assert.equal((await (await fetch(base + '/state')).json()).shuffle, false);
});

test('方法白名单与未知路由', async () => {
  assert.equal((await fetch(base + '/list.json', { method: 'PUT' })).status, 405);
  assert.equal((await fetch(base + '/nope')).status, 404);
});

test('路径穿越与不存在的文件名都被拒', async () => {
  assert.equal((await fetch(base + '/file/' + encodeURIComponent('../a.png'))).status, 404);
  assert.equal((await fetch(base + '/file/..%2f..%2fetc%2fpasswd')).status, 404);
  assert.equal((await fetch(base + '/file/missing.png')).status, 404);
  assert.equal((await fetch(base + '/thumb/a.png')).status, 404);
});

test('文件路由支持 HEAD 与单段 Range', async () => {
  const head = await fetch(base + '/file/a.png', { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('content-length'), '2048');

  const ranged = await fetch(base + '/file/a.png', { headers: { range: 'bytes=0-99' } });
  assert.equal(ranged.status, 206);
  assert.equal(ranged.headers.get('content-range'), 'bytes 0-99/2048');
  assert.equal((await ranged.arrayBuffer()).byteLength, 100);

  const unsatisfiable = await fetch(base + '/file/a.png', { headers: { range: 'bytes=99999-' } });
  assert.equal(unsatisfiable.status, 416);
});

test('删除：缺参 400、未知 404、命中文件进废纸篓并记录跳过名单', async () => {
  assert.equal((await fetch(base + '/delete', json({ kind: 'image' }))).status, 400);
  assert.equal((await fetch(base + '/delete', json({ kind: 'image', name: 'nope.png' }))).status, 404);

  const response = await fetch(base + '/delete', json({ kind: 'image', name: 'victim.png' }));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.trashed, true);
  assert.equal(existsSync(path.join(IMAGES, 'victim.png')), false);
  assert.ok(existsSync(path.join(TRASH, 'victim.png')), '文件应出现在 ~/.Trash');
  assert.match(readFileSync(path.join(HOME, '.dsh', 'wallpaper-sync-skip.txt'), 'utf8'), /victim\.png/);
});

test('废纸篓不可写时回退为硬删除而不是报错', async () => {
  assert.ok(existsSync(TRASH), '上一条测试已建好废纸篓');
  chmodSync(TRASH, 0o500);
  try {
    const response = await fetch(base + '/delete', json({ kind: 'image', name: 'victim2.png' }));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.trashed, false);
    assert.equal(existsSync(path.join(IMAGES, 'victim2.png')), false);
  } finally {
    chmodSync(TRASH, 0o700);
  }
});

test('缩略图清理：删孤儿与陈旧 scratch，留有效与在建', async () => {
  assert.equal(existsSync(path.join(THUMBS, 'orphan.mp4.png')), false);
  assert.equal(existsSync(path.join(THUMBS, '.scratch-100')), false);
  assert.ok(existsSync(path.join(THUMBS, 'clip.mp4.png')));
  assert.ok(existsSync(path.join(THUMBS, '.scratch-200')));
  const hits = await (await fetch(base + '/_hits')).json();
  assert.ok(hits.thumbGc >= 2, '清理计数应上报到 /_hits');
});
