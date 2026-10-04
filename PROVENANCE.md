# 来源与约束

- 本插件是在一次 DSH 会话里**边用边改**打磨出来的：起点是「把 Dynamic Wallpaper.app 的壁纸用作 DSH 桌面客户端背景」，之后逐步长出墨水可读性体系、面板控件、缩略图、播放列表同步与删除功能。
- 素材来自用户本机的 `/Applications/Dynamic Wallpaper.app`（播放列表 → `~/Library/Containers/whbalzac.Dongtaizhuomian/Data/Documents/Videos`）以及用户自己的图片。仓库**不含任何壁纸素材**，只含代码。
- 无第三方运行时依赖：宿主只用 Node 内置模块，客户端是手写的 `h()` 渲染（不是 React），样式通过注入 `<style>` 实现。
- **与宿主 app 的耦合点**：布局类名形如 `_6Qf49G_sidebarCol` / `_6Qf49G_rightbarCol`、语义色板 token `--dsw-*`。DSH 升级后若改名，需要同步改客户端 `lib/client.js` 里的 `SIDEBAR_CSS` / `SIDEBAR_LEFT_CSS` / `inspectSurface()` 跳过分支，以及 `data-dsh-wp-ink` 判定与 `SURFACE_CSS`。
- 使用前请自行确认与你的 DSH 版本兼容；建议先备份 profile 的 `cordis.patch.yml`（`scripts/install.mjs` 会自动备份）。
