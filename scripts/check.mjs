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
    check(file, false, 'missing');
    continue;
  }
  const bad = readFileSync(full, 'utf8').split('\n')
    .map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /^\s*(-\s+)?[A-Za-z_][\w.-]*:\s+\S/.test(line))
    .filter(({ line }) => /:\s/.test(line.replace(/^\s*(-\s+)?[A-Za-z_][\w.-]*:\s*/, '').replace(/'[^']*'|"[^"]*"/g, '')));
  check(file + ' 无未加引号的 ": "', bad.length === 0, bad.map((b) => 'line ' + b.n).join(','));
}

console.log('');
if (failed === 0) {
  console.log('全部通过 ✓');
} else {
  console.log(failed + ' 项未通过 ✗');
  process.exit(1);
}
