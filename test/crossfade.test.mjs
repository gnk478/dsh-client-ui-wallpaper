import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * 交叉淡入淡出（crossfade）行为测试。
 * 这里直接从 lib/client.js 抽出 prefersReducedMotion() / retire() / paint() 三个函数
 * 的真实源码，在最小 DOM 替身上执行——测的是线上那份代码，不是副本。
 */
const SOURCE = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
const START = '/** True when the user asked the system to reduce motion';
const END = '\n\t\t\tfunction load() {';
const startAt = SOURCE.indexOf(START);
const endAt = SOURCE.indexOf(END, startAt);
if (startAt < 0 || endAt < 0) throw new Error('找不到 crossfade 代码块（paint/retire/prefersReducedMotion）');
const BLOCK = SOURCE.slice(startAt, endAt);

const FACTORY = new Function(
  'layer', 'scrim', 'document', 'window', 'setPlayback', 'scheduleInk', 'setTimeout', 'clearTimeout',
  [
    'var FADE_MS = 700;',
    'var current = null;',
    'var fadeTimer;',
    BLOCK,
    'return { paint: paint, retire: retire, prefersReducedMotion: prefersReducedMotion, current: function () { return current; }, fadeTimer: function () { return fadeTimer; } };',
  ].join('\n'),
);

function makeNode(tag) {
  const node = {
    tagName: String(tag).toUpperCase(),
    parentNode: null,
    paused: false,
    offsetWidth: 120,
    attributes: {},
    style: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; },
    removeAttribute(name) { delete this.attributes[name]; },
    pause() { this.paused = true; },
    remove() { if (this.parentNode !== null) this.parentNode.detach(this); },
  };
  return node;
}

function makeLayer() {
  const layer = {
    children: [],
    append(node) { node.parentNode = layer; layer.children.push(node); return node; },
    insertBefore(node, reference) {
      if (node.parentNode !== null) node.parentNode.detach(node);
      const at = layer.children.indexOf(reference);
      if (at < 0) layer.children.push(node); else layer.children.splice(at, 0, node);
      node.parentNode = layer;
      return node;
    },
    detach(node) {
      const at = layer.children.indexOf(node);
      if (at >= 0) layer.children.splice(at, 1);
      if (node.parentNode === layer) node.parentNode = null;
    },
    querySelector() { return null; },
  };
  return layer;
}

function harness(options = {}) {
  const layer = makeLayer();
  const scrim = makeNode('div');
  layer.append(scrim);
  const timers = [];
  const playback = [];
  const ink = [];
  const api = FACTORY(
    layer, scrim,
    { hidden: options.hidden === true },
    { matchMedia: (query) => ({ matches: options.reduceMotion === true && String(query).indexOf('reduced-motion') >= 0 }) },
    (paused) => playback.push(paused),
    (node) => ink.push(node),
    (fn, ms) => { const timer = { fn, ms, cancelled: false }; timers.push(timer); return timer; },
    (timer) => { if (timer) timer.cancelled = true; },
  );
  return { api, layer, scrim, timers, playback, ink, runTimers() { for (const t of timers.splice(0)) if (!t.cancelled) t.fn(); } };
}

test('首次绘制：只挂一个媒体节点 + scrim，且不做过渡', () => {
  const h = harness();
  const first = makeNode('img');
  h.api.paint(first);
  assert.deepEqual(h.layer.children, [first, h.scrim]);
  assert.equal(h.api.current(), first);
  assert.equal(first.getAttribute('data-dsh-wp-current'), '');
  assert.equal(first.style.opacity, '');
  assert.equal(first.style.transition, undefined);
  assert.equal(h.api.fadeTimer(), undefined);
  assert.deepEqual(h.ink, [first], '墨水采样应针对新节点');
});

test('轮换：旧节点留在下层过渡，新节点淡入，旧视频立刻暂停', () => {
  const h = harness();
  const first = makeNode('video');
  h.api.paint(first);
  const second = makeNode('img');
  h.api.paint(second);
  assert.deepEqual(h.layer.children, [first, second, h.scrim], 'scrim 必须始终在最后');
  assert.equal(first.getAttribute('data-dsh-wp-current'), null, '旧节点不再标记为当前');
  assert.equal(second.getAttribute('data-dsh-wp-current'), '');
  assert.equal(second.style.opacity, '1');
  assert.match(String(second.style.transition), /opacity 700ms/);
  assert.equal(first.paused, true, '过渡开始时旧视频应暂停，避免双路解码');
  assert.equal(h.timers.length, 1);
  assert.equal(h.timers[0].ms, 780);
});

test('过渡结束：旧节点被回收，新节点样式复原', () => {
  const h = harness();
  const first = makeNode('img');
  h.api.paint(first);
  const second = makeNode('img');
  h.api.paint(second);
  h.runTimers();
  assert.deepEqual(h.layer.children, [second, h.scrim]);
  assert.equal(second.style.transition, '');
  assert.equal(second.style.opacity, '');
  assert.equal(h.api.fadeTimer(), undefined);
});

test('连续轮换不会堆节点：上一次的旧节点被立刻回收', () => {
  const h = harness();
  const a = makeNode('img');
  const b = makeNode('img');
  const c = makeNode('img');
  h.api.paint(a);
  h.api.paint(b);
  h.api.paint(c);
  assert.deepEqual(h.layer.children, [b, c, h.scrim]);
  assert.deepEqual(h.ink, [a, b, c]);
  assert.equal(h.timers[0].cancelled, true, '上一轮过渡定时器应被取消');
});

test('窗口隐藏时直接替换，不留双节点', () => {
  const h = harness({ hidden: true });
  const a = makeNode('img');
  h.api.paint(a);
  const b = makeNode('img');
  h.api.paint(b);
  assert.deepEqual(h.layer.children, [b, h.scrim]);
  assert.equal(b.style.transition, undefined);
  assert.ok(h.playback.length >= 1 && h.playback.every((value) => value === true), '隐藏时每次绘制都应暂停视频');
});

test('系统开启「减少动态效果」时直接替换', () => {
  const h = harness({ reduceMotion: true });
  assert.equal(h.api.prefersReducedMotion(), true);
  const a = makeNode('img');
  h.api.paint(a);
  const b = makeNode('img');
  h.api.paint(b);
  assert.deepEqual(h.layer.children, [b, h.scrim]);
  assert.equal(b.style.transition, undefined);
});

test('层里出现陌生节点时被回收', () => {
  const h = harness();
  const stray = makeNode('img');
  h.layer.append(stray);
  const a = makeNode('img');
  h.api.paint(a);
  assert.deepEqual(h.layer.children, [a, h.scrim]);
});

test('同一节点重复绘制不会自我销毁', () => {
  const h = harness();
  const a = makeNode('img');
  h.api.paint(a);
  h.api.paint(a);
  assert.deepEqual(h.layer.children, [a, h.scrim]);
});
