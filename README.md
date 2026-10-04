# dsh-client-ui-wallpaper

[![check](https://github.com/gnk478/dsh-client-ui-wallpaper/actions/workflows/check.yml/badge.svg)](https://github.com/gnk478/dsh-client-ui-wallpaper/actions/workflows/check.yml)

把本地图片 / 视频（例如 [Dynamic Wallpaper.app](https://apps.apple.com/app/id1505218567) 播放列表里的素材）
用作 **DSH 桌面客户端**的背景：整窗铺满、背景模糊、面板与左右侧栏透明度分别可控，字色跟着壁纸明暗自动切换。

> 这是 `~/.dsh/profiles/desktop/plugins/dsh-client-ui-wallpaper` 的完整项目版：含挂载声明、安装脚本、自检脚本与文档。

![界面示意](docs/preview.png)

> 上图为**示意**（脚本绘制，非真实截图）：壁纸铺满整窗、设置面板半透明、右侧栏 35%、左栏保持透明、代码块按深色外观取深底浅字。

## 功能

**背景**

- 图片或视频铺满整窗（`object-fit: cover`），面板半透明让壁纸透出来；弹窗保持不透明
- 背景模糊可调（0–60px）；可选纱层（浅色外观白纱 / 深色外观黑纱）
- 静态与动态分开：图片可配「同名视频」，网格里用 **▶ 动态** 一键切换
- 轮换：间隔 15 秒–24 小时可调；支持「全选 / 仅深色动态 / 清空 / 默认」

**可读性（墨水）**

- 按壁纸亮度自动切深/浅字（含代码块、行内 code、气泡、工具栏、输入框与 caret）
- **代码块只跟外观走**：浅色外观浅底深字、深色外观深底浅字（绕开 `pre.shiki` 透明背景导致的误判）
- 设置弹窗内的字色复位为「该外观本来的值」，不被壁纸影响

**面板与控件**（设置 → 壁纸）

| 控件 | 说明 |
|---|---|
| 壁纸网格 | 静态/动态分组，缩略图 + 深/浅角标 + `✓/+` 轮换勾选 + 当前/播放中标记 |
| 背景模糊 | 滑块 + `− [数字框] +` 精确步进（0–60，居中、无原生箭头） |
| 右侧栏透明度 | 0–100% 线性，独立于面板；左栏保持原透明观感 |
| 只轮换深色 / 只轮换浅色 | 优先用缩略图实测亮度判定，未采样时按配置名单取反 |
| 自动加入新壁纸 | 新丢进目录的素材自动入库并追加进轮换 |
| 自动轮换 / 间隔 | 秒数可调 |
| 浅色壁纸用深色字 | 关掉就固定用浅色字 |
| 同步播放列表 | 一键把 Dynamic Wallpaper.app 播放列表里的素材同步进来 |
| 删除（缩略图悬停） | 删文件 + 删缩略图缓存 + 从轮换移除 + 记入同步跳过名单 |
| 侧栏小圆钉 | 与头像中心对齐的收起按钮，点空白处自动收回 |

## 快速开始

```bash
git clone <本仓库> dsh-client-ui-wallpaper && cd dsh-client-ui-wallpaper

# 1) 装进某个 profile（默认 desktop）；会先备份 profile 的 cordis.patch.yml
node scripts/install.mjs --profile desktop

# 2) 准备素材
mkdir -p ~/.dsh/wallpapers ~/.dsh/videos
cp ~/Pictures/some.jpg ~/.dsh/wallpapers/          # 静态壁纸
cp ~/Movies/some.mp4  ~/.dsh/videos/               # 动态壁纸

# 3) 自检 & 重启
node scripts/check.mjs
```

然后刷新页面（或重启 DSH），打开 **设置 → 壁纸** 即可。

也可以走 DSH 自己的插件安装：

```bash
dsh plugin --profile desktop add link:/绝对路径/dsh-client-ui-wallpaper
```

## 配置

### config（`cordis.patch.yml` 的 `ui-wallpaper` 行，见 [examples/profile-cordis.patch.yml](examples/profile-cordis.patch.yml)）

| 键 | 默认 | 说明 |
|---|---|---|
| `imageDir` / `videoDir` | `~/.dsh/wallpapers` / `~/.dsh/videos` | 素材目录 |
| `mode` | `image` | `image` / `video` / `rotate` |
| `image` / `video` | `''` | 固定的文件名 |
| `live` | `false` | 图片有同名视频时用视频做动态壁纸 |
| `rotateSeconds` | `300` | 轮换间隔（秒） |
| `blur` | `8` | 背景模糊（px） |
| `panelOpacity` | `0` | 面板不透明度（0 = 全透） |
| `windowOpacity` | `0.96` | 弹窗不透明度 |
| `dim` | `0` | 纱层强度 |
| `autoInk` | `true` | 按壁纸亮度自动切字色 |
| `autoInclude` | `true` | 新素材自动加入轮换 |
| `only` / `darkVideos` | `[]` | 深色壁纸 / 深色动态白名单 |

### state（`~/.dsh/wallpaper-state.json`，面板里改的都落这里）

`mode`、`image`、`video`、`live`、`rotation`、`only`、`videoPool`、`blur`、`panelOpacity`、`sidebarOpacity`（`null` = 跟随面板）、`autoInk`、`autoInclude`、`knownFiles`、`lastAdded`、`rotateSeconds`

```bash
# 直接读/写状态（调试用）
curl -s  http://127.0.0.1:19387/wallpaper/state
curl -s -X POST -H 'content-type: application/json' \
     -d '{"sidebarOpacity":0.35}' http://127.0.0.1:19387/wallpaper/state
```

## 与 Dynamic Wallpaper.app 同步

app 的播放列表在：

```
~/Library/Containers/whbalzac.Dongtaizhuomian/Data/Documents/
  ├── Videos/                播放列表素材
  ├── Wallpaper/             静态壁纸
  └── Setting/Preferences.json   playlist_array（播放列表）
```

两种同步方式（都**只增不删**；读取该目录需要给 DSH「完全磁盘访问权限」）：

```bash
# 面板：设置 → 壁纸 → 同步播放列表
# 或命令行
./sync-wallpaper-playlist.sh            # 只同步播放列表里的视频
./sync-wallpaper-playlist.sh --stills   # 连静态壁纸目录一起
```

同步会跳过 `~/.dsh/wallpaper-sync-skip.txt` 里列出的文件名（删除过的素材会自动写进去，防止被拉回）。

## 目录结构

```
dsh-client-ui-wallpaper/
├── lib/
│   ├── index.js                 宿主：路由 / 扫描 / 状态 / 抽帧 / 同步 / 删除
│   └── client.js                客户端：注入样式 / 铺背景 / 面板 UI / 墨水判定
├── scripts/
│   ├── install.mjs              安装进 profile（备份 + 复制 + 写 insert 行）
│   └── check.mjs                静态自检（语法 + 路由 + 样式常量 + 控件）
├── docs/ARCHITECTURE.md         架构、路由表、样式常量、踩坑记录
├── examples/profile-cordis.patch.yml  带完整配置的挂载示例
├── cordis.patch.yml             本插件的挂载声明
├── CHANGELOG.md / PROVENANCE.md / LICENSE
└── README.md
```

## 开发

- 宿主是普通 cordis 插件，改完由 DSH 的 HMR 重载；客户端 `lib/client.js` 改动会被热替换（注意：**热替换会重置模块级变量**，需要跨次保留的数据要放 `window` / sessionStorage）
- 自检：

  ```bash
  node scripts/check.mjs
  curl -s http://127.0.0.1:19387/wallpaper/_client | python3 -m json.tool | head -40   # 客户端自报状态
  curl -s http://127.0.0.1:19387/wallpaper/_hits                                        # 各路由请求计数
  ```

## 发布与打包

```bash
# npm 发布（可选；包名 dsh-client-ui-wallpaper，publishConfig.access = public）
npm login
npm publish                        # prepublishOnly 会先跑 scripts/check.mjs

# 打 zip 附到 Release
git archive --format=zip -o dsh-client-ui-wallpaper-1.0.0.zip HEAD
gh release upload v1.0.0 dsh-client-ui-wallpaper-1.0.0.zip
```

**启用 GitHub Actions（CI）**：配置文件在 [`examples/github-workflow-check.yml`](examples/github-workflow-check.yml) ——
OAuth App 令牌缺 `workflow` 权限，`.github/workflows/` 推不上去，二选一：

1. 在 GitHub 网页上新建 `.github/workflows/check.yml`，内容复制该文件
2. `gh auth refresh -s workflow` 授权后，把该文件放回 `.github/workflows/` 再推送

## 故障排查

| 症状 | 原因 / 处理 |
|---|---|
| 壁纸没铺满 | 面板里确认已选壁纸；检查 `/wallpaper/list.json` 是否有素材 |
| 侧栏/右栏透明度拖了没反应 | 常见于「透明化扫描」清掉了底色；本版本已对右栏跳过扫描并直接写 `background-color`。若自行改过选择器，核对 `SIDEBAR_CSS` / `SIDEBAR_LEFT_CSS` |
| 代码块字看不清 | 代码块应「只跟外观走」；检查 `CODEFIX_CSS` 是否注入 |
| 视频缩略图一直是灰的 | 首次访问 `/wallpaper/thumb/<name>` 会调 `qlmanage` 抽帧，稍等再刷新；检查 `~/.dsh/wallpaper-thumbs/` |
| 新素材不出现 | 刷新面板（宿主每次请求都会重扫目录）；确认扩展名在白名单（图片 jpg/jpeg/png/webp/gif/avif/bmp，视频 mp4/webm/mov/m4v） |
| 改了 profile 文件不生效 | DSH 运行中会用内存配置回写 profile 文件；完全退出后再改，或改用「设置」界面 |
| 面板打不开 / 报错 | 看 `/wallpaper/_client` 的 `lastError`，以及宿主日志 |

## 已知限制

- 与 DSH 的布局类名（`_6Qf49G_*`）和色板 token（`--dsw-*`）耦合，DSH 升级后可能需要同步调整
- 播放列表同步依赖 macOS 的 TCC 权限（完全磁盘访问）与 `qlmanage`（缩略图抽帧）
- 删除是**真删磁盘文件**（有二次确认，但没有回收站）

## License

[MIT](LICENSE)
