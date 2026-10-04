#!/usr/bin/env node
/**
 * 把本插件安装进某个 DSH profile：
 *   node scripts/install.mjs --profile desktop [--with-config]
 * 做的事：备份 profile 的 cordis.patch.yml → 复制 lib/package.json/README → 确保 insert 行存在。
 */
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const argv = process.argv.slice(2);
function flag(name, fallback) {
  const index = argv.indexOf(name);
  return index >= 0 && argv[index + 1] ? argv[index + 1] : fallback;
}

const profile = flag('--profile', 'desktop');
const profileDir = path.join(os.homedir(), '.dsh', 'profiles', profile);
const pluginDir = path.join(profileDir, 'plugins', 'dsh-client-ui-wallpaper');
const patchPath = path.join(profileDir, 'cordis.patch.yml');

if (!existsSync(profileDir)) {
  console.error('找不到 profile：' + profileDir);
  process.exit(1);
}

let running = false;
try {
  execFileSync('pgrep', ['-f', 'DeepSeek Harness'], { stdio: 'pipe' });
  running = true;
} catch {}

mkdirSync(path.join(pluginDir, 'lib'), { recursive: true });
cpSync(path.join(ROOT, 'lib'), path.join(pluginDir, 'lib'), { recursive: true });
for (const file of ['package.json', 'README.md', 'LICENSE']) {
  const from = path.join(ROOT, file);
  if (existsSync(from)) copyFileSync(from, path.join(pluginDir, file));
}
console.log('已复制插件 -> ' + pluginDir);

const INSERT = ['', '# dsh-client-ui-wallpaper（由 install.mjs 追加）', '- insert:', '    - id: ui-wallpaper', '      name: ./plugins/dsh-client-ui-wallpaper/lib/index.js', ''].join('\n');
if (!existsSync(patchPath)) {
  writeFileSync(patchPath, INSERT.replace(/^\n/, ''));
  console.log('已新建 ' + patchPath);
} else {
  const text = readFileSync(patchPath, 'utf8');
  if (text.includes('ui-wallpaper')) {
    console.log('cordis.patch.yml 里已有 ui-wallpaper 行，跳过');
  } else {
    const backup = patchPath + '.bak-' + Date.now();
    copyFileSync(patchPath, backup);
    writeFileSync(patchPath, text.replace(/\s*$/, '\n') + INSERT);
    console.log('已追加 insert 行（备份：' + backup + '）');
  }
}

if (running) {
  console.log('');
  console.log('提示：DSH 正在运行。新增插件通常靠 HMR 生效；若插件没出现，完全退出 DSH 再启动一次');
  console.log('      （运行中的 DSH 会用内存配置回写 profile 文件，手工改动可能被覆盖）。');
} else {
  console.log('');
  console.log('DSH 未在运行，直接启动即可看到插件。');
}
