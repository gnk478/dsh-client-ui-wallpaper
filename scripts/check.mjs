#!/usr/bin/env node
/** 静态自检：语法 + 关键结构（宿主路由、客户端样式常量与面板控件）是否齐全。 */
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const HOST = path.join(ROOT, 'lib', 'index.js');
const CLIENT = path.join(ROOT, 'lib', 'client.js');

let failed = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log('  ok   ' + label);
  } else {
    failed += 1;
    console.log('  FAIL ' + label + (detail ? '  <- ' + detail : ''));
  }
}

console.log('1) 语法检查');
for (const file of [HOST, CLIENT]) {
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    console.log('  ok   ' + path.relative(ROOT, file));
  } catch (error) {
    failed += 1;
    console.log('  FAIL ' + path.relative(ROOT, file) + '  <- ' + String(error.stderr || error.message).slice(0, 300));
  }
}

const host = readFileSync(HOST, 'utf8');
const client = readFileSync(CLIENT, 'utf8');

console.log('2) 宿主路由');
for (const route of ['/wallpaper/list.json', '/wallpaper/state', '/wallpaper/file/', '/wallpaper/thumb/', '/wallpaper/sync', '/wallpaper/delete', '/wallpaper/_client', '/wallpaper/_hits', '/wallpaper/_probe']) {
  check(route, host.includes(route));
}

console.log('3) 宿主能力');
  check('缩略图 qlmanage 抽帧', host.includes('qlmanage'));
  check('新素材自动加入轮换 autoIncludeNew', host.includes('autoIncludeNew'));
  check('播放列表同步 syncFromPlaylist', host.includes('syncFromPlaylist'));
  check('目录扫描 scan()', host.includes('const scan ='));
  check('缩略图缓存目录 wallpaper-thumbs', host.includes('wallpaper-thumbs'));
  check('状态落盘 wallpaper-state.json', host.includes('wallpaper-state.json'));

console.log('4) 客户端样式与控件');
for (const token of ['--dsh-wp-blur', '--dsh-wp-sidebar', '--dsh-wp-panel', 'data-dsh-wp-ink', 'CODE_CSS', 'SIDEBAR_CSS', 'SIDEBAR_LEFT_CSS', 'PANEL_CSS', 'NUMBER_CSS', 'COMPOSER_CSS', 'SURFACE_CSS', 'dsh-wp-del', 'dsh-wp-panel-number']) {
  check(token, client.includes(token));
}
for (const fn of ['applyAutoInk', 'applySidebarVar', 'syncPlaylist', 'removeWallpaper', 'lightKeys', 'darkKeys', 'installAutoCollapse', 'classifyTile']) {
  check(fn + '()', client.includes('function ' + fn));
}

console.log('5) 右侧栏透明度指向 _rightbarCol（不是左栏）');
  check('透明化扫描跳过 rightbarCol', client.includes('el.matches("[class*=\\"_rightbarCol\\"]")'));
  check('样式命中 rightbarCol', client.includes('[class*=\\"_rightbarCol\\"]'));
  check('左栏保留透明', client.includes('SIDEBAR_LEFT_CSS'));

console.log('6) 1.0.2 行为（回收站删除 / 缩略图 GC / 随机轮换 / 视频暂停）');
  check('回收站删除 trashFile()', host.includes('async function trashFile'));
  check('移入 ~/.Trash', host.includes("'.Trash'"));
  check('跨卷回退硬删除', host.includes('await rm(target, { force: true })'));
  check('缩略图 GC gcThumbs()', host.includes('const gcThumbs = async'));
  check('scratch 宽限 .scratch-', host.includes("startsWith('.scratch-')"));
  check('shuffle 校验', host.includes('shuffle must be a boolean'));
  check('shuffle 落盘', host.includes('patch.shuffle = body.shuffle'));
  check('随机轮换 nextIndex()', client.includes('function nextIndex'));
  check('视频暂停 setPlayback()', client.includes('function setPlayback'));
  check('visibilitychange 监听', client.includes('visibilitychange'));
  check('隐藏时挂起重绘 pendingPaint', client.includes('pendingPaint'));
  check('面板随机轮换开关', client.includes('随机轮换'));
  check('行为测试 test/host.test.mjs', existsSync(path.join(ROOT, 'test', 'host.test.mjs')));

console.log('7) workflow YAML 行内校验（未加引号的 ": " 会让 Actions 直接 startup_failure）');
for (const file of ['.github/workflows/check.yml', '.github/workflows/publish.yml', 'examples/github-workflow-check.yml', 'examples/github-workflow-publish.yml']) {
  const full = path.join(ROOT, file);
  if (!existsSync(full)) {
    // npm 包里不带 .github/，只带 examples/ 的两份副本——缺 .github 时跳过，不算失败
    if (file.startsWith('.github/')) {
      console.log('  skip ' + file + '（不在 npm 包里）');
      continue;
    }
    check(file, false, 'missing');
    continue;
  }
  const bad = readFileSync(full, 'utf8').split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /^\s*(-\s+)?[A-Za-z_][\w.-]*:\s+\S/.test(line))
    .filter(({ line }) => /:\s/.test(line.replace(/^\s*(-\s+)?[A-Za-z_][\w.-]*:\s*/, '').replace(/'[^']*'|"[^"]*"/g, '')));
  check(file + ' 无未加引号的 ": "', bad.length === 0, bad.map((b) => 'line ' + b.n).join(','));
}

console.log('8) 1.1.0 轮换交叉淡入淡出（crossfade）');
  check('过渡时长 FADE_MS', client.includes('var FADE_MS = 700'));
  check('当前节点定位 currentMedia()', client.includes('function currentMedia'));
  check('当前节点标记 data-dsh-wp-current', client.includes('data-dsh-wp-current'));
  check('新节点插到面纱之前 insertBefore(node, scrim)', client.includes('layer.insertBefore(node, scrim)'));
  check('回收旧节点 retire()', client.includes('function retire(node)'));
  check('尊重 prefers-reduced-motion', client.includes('(prefers-reduced-motion: reduce)'));
  check('paint 不再整层清空', !client.includes('layer.replaceChildren()'));
  check('面纱只创建一次', client.split('scrim.className = "dsh-wallpaper-scrim"').length - 1 === 1);
  check('探针上报 crossfade 标记', client.includes('crossfade: FADE_MS'));
  check('crossfade 行为测试 test/crossfade.test.mjs', existsSync(path.join(ROOT, 'test', 'crossfade.test.mjs')));

console.log('9) 1.1.1 首帧就绪再淡入（修「偶尔没有淡入淡出」）');
  check('首帧等待上限 READY_MS', client.includes('var READY_MS = 600'));
  check('首帧判定 frameReady()', client.includes('function frameReady(node)'));
  check('等首帧 whenFrame()', client.includes('function whenFrame(node)'));
  check('淡入实现 fadeIn()', client.includes('function fadeIn(node, previous)'));
  check('层内清理 settle()', client.includes('function settle()'));
  check('切换原因 noteSwitch()', client.includes('function noteSwitch(reason, previous, node)'));
  check('探针上报 switches', client.includes('switches: switchStats'));
  check('探针上报 ready', client.includes('ready: READY_MS'));
  check('视频预读 preload = "auto"', client.includes('video.preload = "auto"'));
  check('预热节点不抢播 dshWpPrewarm', client.includes('dshWpPrewarm'));
  check('轮换提前预热 armPrewarm()', client.includes('function armPrewarm()'));
  check('打断守卫 paintSeq', client.includes('seq !== paintSeq'));

console.log('10) 1.1.2 探针实时化 / 图层自愈 / 预热阈值');
  check('图层审计 auditLayer()', client.includes('function auditLayer()'));
  check('过渡宽限 AUDIT_GRACE_MS', client.includes('var AUDIT_GRACE_MS = FADE_MS + 250'));
  check('挂载时间戳 dshWpMountedAt', client.includes('node.dataset.dshWpMountedAt = String(Date.now())'));
  check('审计在 sweep 里跑', client.includes('var audited = auditLayer()'));
  check('审计明细 mediaChildInfo()', client.includes('function mediaChildInfo(child)'));
  check('探针上报 layerDetail/audit/prewarm', client.includes('layerDetail:') && client.includes('audit: layerAudit') && client.includes('prewarm: prewarmStats'));
  check('切换即上报 scheduleProbe()', client.includes('function scheduleProbe()'));
  check('上报防抖 PROBE_DEBOUNCE_MS', client.includes('var PROBE_DEBOUNCE_MS = 600'));
  check('周期心跳 PROBE_PERIOD_MS', client.includes('var PROBE_PERIOD_MS = 60000') && client.includes('if (!disposed) sendProbe()'));
  check('预热阈值 PREWARM_MAX_BYTES', client.includes('var PREWARM_MAX_BYTES = 50 * 1024 * 1024'));
  check('用 HEAD 问文件大小', client.includes('method: "HEAD"'));
  check('丢弃未用预热节点 discardWarmed()', client.includes('function discardWarmed()'));
  check('预热计数 prewarmStats', client.includes('prewarmStats.skipped += 1') && client.includes('prewarmStats.dropped += 1'));
  check('审计行为测试', readFileSync(path.join(ROOT, 'test', 'crossfade.test.mjs'), 'utf8').includes('图层审计'));

console.log('11) 1.1.3 轮换加载路径（1.1.1/1.1.2 丢声明导致 load() 一直静默失败）');
  check('轮换间隔 seconds 有声明', client.includes('var seconds = Number(config.rotateSeconds)'));
  check('间隔下限 clamp 到 600', client.includes('if (!isFinite(seconds) || seconds < 15) seconds = 600'));
  check('轮换游标 index 有声明', client.includes('var index = 0;'));
  check('首帧停在当前素材', client.includes('if (sequence[k].name === image || sequence[k].name === video) { index = k; break; }'));
  check('rotate 分支结束即 return', client.includes('\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}'));
  check('加载失败留痕 loadFailure', client.includes('var loadFailure = null'));
  check('探针上报 loadFailure', client.includes('loadFailure: loadFailure'));
  check('reportClient 上报 loadFailure', client.includes('payload.loadFailure = loadFailure'));
  check('成功加载清空 loadFailure', client.includes('appliedSignature = signature;\n\t\t\t\t\tloadFailure = null;'));
  check('catch 记录错误不再静默', client.includes('message: error && error.message !== undefined'));
  check('轮换加载路径测试 test/rotate.test.mjs', existsSync(path.join(ROOT, 'test', 'rotate.test.mjs')));
console.log('');
if (failed === 0) {
  console.log('全部通过 ✓');
} else {
  console.log(failed + ' 项未通过 ✗');
  process.exit(1);
}
