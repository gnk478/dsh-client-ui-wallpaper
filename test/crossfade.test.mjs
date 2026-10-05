import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/**
 * 交叉淡入淡出（crossfade）行为测试。
 * 直接抽出 lib/client.js 里的真实源码（模块级 frameReady/whenFrame/mediaLabel +
 * apply() 内的 prefersReducedMotion/retire/startVideo/settle/noteSwitch/fadeIn/paint），
 * 在最小 DOM 替身上执行——测的是线上那份代码，不是副本。
 */
const SOURCE = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8');
const START = '/** True when the user asked the system to reduce motion';
const END = '\n\t\t\tfunction load() {';
const startAt = SOURCE.indexOf(START);
const endAt = SOURCE.indexOf(END, startAt);
if (startAt < 0 || endAt < 0) throw new Error('找不到 crossfade 代码块（paint/retire/prefersReducedMotion）');
const BLOCK = SOURCE.slice(startAt, endAt);

const HELPERS_START = '/** Longest we wait for a media node';
const HELPERS_END = '/** The media node currently on screen';
const helpersAt = SOURCE.indexOf(HELPERS_START);
const helpersEnd = SOURCE.indexOf(HELPERS_END, helpersAt);
if (helpersAt < 0 || helpersEnd < 0) throw new Error('找不到首帧就绪辅助函数（READY_MS/frameReady/whenFrame/mediaLabel）');
const HELPERS = SOURCE.slice(helpersAt, helpersEnd);

const FACTORY = new Function(
  'layer', 'scrim', 'document', 'window', 'setPlayback', 'scheduleInk', 'setTimeout', 'clearTimeout',
  [
    'var FADE_MS = 700;',
    'var current = null;',
    'var fadeTimer;',
    'var paintSeq = 0;',
    'var prewarmTimer;',
    'var disposed = false;',
    HELPERS,
    BLOCK,
    'return { paint: paint, retire: retire, auditLayer: auditLayer, prefersReducedMotion: prefersReducedMotion, current: function () { return current; }, fadeTimer: function () { return fadeTimer; }, switchStats: function () { return switchStats; }, layerAudit: function () { return layerAudit; } };',
  ].join('\n'),
);

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

function makeNode(tag, options = {}) {
  const name = String(tag).toUpperCase();
  const ready = options.ready !== false;
  const node = {
    tagName: name,
    parentNode: null,
    paused: false,
    offsetWidth: 120,
    src: '',
    currentSrc: '',
    readyState: name === 'VIDEO' ? (ready ? 4 : 0) : 0,
    complete: name === 'IMG' ? ready : false,
    naturalWidth: name === 'IMG' && ready ? 8 : 0,
    attributes: {},
    listeners: {},
    dataset: {},
    style: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null; },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener(name, fn) { (this.listeners[name] = this.listeners[name] || []).push(fn); },
    removeEventListener(name, fn) {
      const list = this.listeners[name];
      if (!list) return;
      const at = list.indexOf(fn);
      if (at >= 0) list.splice(at, 1);
    },
    dispatch(name) {
      const list = (this.listeners[name] || []).slice();
      for (const fn of list) fn();
    },
    play() { this.paused = false; return undefined; },
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
  assert.equal(h.api.switchStats().lastReason, 'instantFirst');
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
  assert.equal(h.api.switchStats().lastReason, 'instantReduced');
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

test('新节点还没首帧时先等待，首帧就绪后才淡入', async () => {
  const h = harness();
  const first = makeNode('img');
  h.api.paint(first);
  const second = makeNode('img', { ready: false });
  h.api.paint(second);
  assert.deepEqual(h.layer.children, [first, second, h.scrim], '等待期间新节点已挂上但不透明');
  assert.equal(second.style.opacity, '0');
  assert.equal(h.api.fadeTimer(), undefined, '首帧没来就不应该开始过渡');
  assert.equal(h.api.switchStats().waited, 1);
  second.dispatch('loadeddata');
  await flush();
  assert.equal(h.api.fadeTimer().ms, 780, '首帧到达后才开始 700ms 过渡');
  assert.equal(second.style.opacity, '1');
  assert.equal(h.api.switchStats().lastReason, 'fade');
  assert.equal(h.api.switchStats().fade, 1);
  h.runTimers();
  assert.deepEqual(h.layer.children, [second, h.scrim]);
});

test('首帧迟迟不来时按 READY_MS 兜底淡入', async () => {
  const h = harness();
  const first = makeNode('img');
  h.api.paint(first);
  const second = makeNode('img', { ready: false });
  h.api.paint(second);
  assert.equal(h.timers.length, 1, '应挂一个 600ms 兜底定时器');
  assert.equal(h.timers[0].ms, 600);
  h.runTimers();
  await flush();
  assert.equal(h.api.fadeTimer().ms, 780);
  assert.equal(second.style.opacity, '1');
});

test('打断上一次淡入：被取消的旧节点不会卡在层里', () => {
  const h = harness();
  const a = makeNode('img');
  h.api.paint(a);
  const b = makeNode('img');
  h.api.paint(b);
  const c = makeNode('img');
  h.api.paint(c);
  assert.equal(h.timers[0].cancelled, true);
  h.runTimers();
  assert.deepEqual(h.layer.children, [c, h.scrim], '层里只能剩当前节点');
  assert.equal(h.api.switchStats().fade, 2);
});

test('图层审计：超过过渡宽限的陌生节点被回收并计数', () => {
  const h = harness();
  const a = makeNode('img');
  h.api.paint(a);
  const stray = makeNode('video');
  stray.dataset.dshWpMountedAt = String(Date.now() - 5000);
  h.layer.append(stray);
  const removed = h.api.auditLayer();
  assert.equal(removed, 1);
  assert.deepEqual(h.layer.children, [a, h.scrim], '陌生节点应被回收，当前节点与面纱保留');
  assert.equal(stray.paused, true, '被回收的视频应先暂停');
  const audit = h.api.layerAudit();
  assert.equal(audit.checks, 1);
  assert.equal(audit.removed, 1);
  assert.equal(audit.last.removed, 1);
});

test('图层审计：正在过渡的旧节点处在宽限期内，不被打断', () => {
  const h = harness();
  const a = makeNode('img');
  h.api.paint(a);
  const b = makeNode('img');
  h.api.paint(b);
  assert.deepEqual(h.layer.children, [a, b, h.scrim], '过渡中：旧节点仍在下层');
  assert.equal(h.api.auditLayer(), 0, '刚挂上的旧节点在 AUDIT_GRACE_MS 内，不应被回收');
  assert.deepEqual(h.layer.children, [a, b, h.scrim]);
  assert.equal(h.api.layerAudit().removed, 0);
});

test('图层审计：没有时间戳的陌生节点也按超龄处理', () => {
  const h = harness();
  const a = makeNode('img');
  h.api.paint(a);
  const stray = makeNode('img');
  h.layer.append(stray);
  assert.equal(h.api.auditLayer(), 1);
  assert.deepEqual(h.layer.children, [a, h.scrim]);
});
