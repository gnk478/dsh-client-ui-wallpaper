# 更新日志

## 1.0.1 — 2026-10-05

- **发布到 npm**：[`dsh-client-ui-wallpaper`](https://www.npmjs.com/package/dsh-client-ui-wallpaper)（`publishConfig.access = public`；首个版本经 staged publishing 审批后上线）
- README 新增「安装」章节（npm / 源码 / DSH 插件管理器三种方式）与 npm 徽章
- 新增 [`.github/workflows/publish.yml`](.github/workflows/publish.yml)：用 **Trusted Publishing（OIDC）** 发布，不再需要长期 token（`permissions: id-token: write`，tag `v*` 或手动触发）
- 修正文档里 `imageDir` / `videoDir` 的默认值：实际默认是 Dynamic Wallpaper.app 素材库的 `Wallpaper/`、`Videos/`（`lib/index.js:37-39`），不是 `~/.dsh/wallpapers`；并注明 config 必须写绝对路径（插件不做 `~` 展开）
- 生命周期脚本 `install` 改名为 `install:plugin`，避免别人 `npm install` 这个包时被自动写进 `~/.dsh/profiles`

## 1.0.0 — 2026-10-04

首个打包版本。把此前在 `~/.dsh/profiles/desktop/plugins/dsh-client-ui-wallpaper` 里边用边改的代码，整理成一个自洽的项目（含挂载声明、安装脚本、自检、文档）。

**壁纸与背景**

- 图片/视频铺满整窗（`object-fit: cover`），面板透明让壁纸透出来
- 背景模糊（`--dsh-wp-blur`）、可选纱层（`dim`）、弹窗不透明度（`windowOpacity`）与面板分开控制
- 图片 + 同名视频配对，可用「▶ 动态」把静态壁纸换成动态
- 轮换：间隔可调（15s–24h），支持「全选 / 仅深色动态 / 清空 / 默认」

**可读性（墨水）体系**

- 按壁纸亮度自动切换深/浅字（`body[data-dsh-wp-ink]`），元素级采样（16×8 canvas + `object-fit: cover` 映射）
- 代码块**只跟外观走**（浅色外观浅底深字、深色外观深底浅字）——绕开 `pre.shiki` 透明背景导致的误判
- 行内 code、气泡、工具栏、输入框（含 caret）、设置弹窗各自处理；设置弹窗字色复位为外观原值

**面板与控件**

- 侧栏小圆钉：与用户头像中心对齐，点空白自动收回
- 设置面板：静态/动态壁纸网格（缩略图 + 深/浅角标 + `✓/+` 轮换勾选 + 当前/播放中标记）
- 「只轮换深色」「只轮换浅色」（优先用实测亮度，未采样时按配置名单取反）
- 「自动加入新壁纸」：新丢进目录的素材自动入库并追加进轮换
- 毛玻璃滑块 + `− [数字框] +` 精确步进（0–60，居中、隐藏原生 spinner）
- **右侧栏透明度**：独立滑块（0–100% 线性），左栏保持原透明观感
- **删除壁纸**：缩略图悬停出现「删除」，删文件 + 缩略图缓存 + 轮换项 + 记入同步跳过名单
- **同步播放列表**：一键把 Dynamic Wallpaper.app 播放列表里的素材同步进来

**工程**

- `docs/screenshot.png` 界面截图（真实运行截图原图 1800×1169，未裁切未遮挡）；npm `publishConfig` / `prepublishOnly` 自检
- 状态落盘 `~/.dsh/wallpaper-state.json`；缩略图缓存 `~/.dsh/wallpaper-thumbs/`
- 自检路由：`/wallpaper/_client`、`/wallpaper/_hits`、`/wallpaper/_probe`
- `scripts/check.mjs` 静态自检、`scripts/install.mjs` 安装进 profile、`cordis.patch.yml` 挂载声明