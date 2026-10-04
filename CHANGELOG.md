# 更新日志

## 1.1.1 — 2026-10-05

- **修：偶尔看不到淡入**：淡入前先等新壁纸首帧就绪（视频 `loadeddata`、图片 `load`/`decode`，`READY_MS = 600` 兜底超时照常淡入）——之前大体积视频解码慢，0.7s 过渡淡的是一个空节点，首帧上来时已经是硬切
- **修：打断过渡时旧节点卡在层里**：`settle()` 统一回收除面纱与当前节点以外的媒体节点，`paintSeq` 守卫被打断的等待回调
- **轮换预热**：切换前 8 秒预建下一项（`preload = "auto"`），预热节点不抢播
- **可观测**：`/_probe` 增加 `ready` 与 `switches`（fade / waited / instantFirst / instantSame / instantHidden / instantReduced + lastReason/lastAt/lastFrom/lastTo），「有时候没淡」可直接量化
- **测试**：`test/crossfade.test.mjs` 扩到 11 例（首帧未就绪先等待、600ms 兜底、打断后旧节点被回收），`node --test` 共 19 例；`scripts/check.mjs` 加第 9 节 13 项

## 1.1.0 — 2026-10-05

- **轮换交叉淡入淡出**：换壁纸不再整层清空重建，改为新节点插在常驻面纱之前、旧节点留在下层淡出 0.7s 后再回收；`data-dsh-wp-current` 标记当前节点，自动字色与探针都改按当前节点取色，避免旧图层导致字色闪错
- **尊重系统「减少动态效果」**：`prefers-reduced-motion: reduce`、窗口隐藏、首次绘制、重绘同一节点时都直接替换，不做过渡
- **测试**：新增 `test/crossfade.test.mjs`——把 `lib/client.js` 里真实的绘制/回收源码抽出来在最小 DOM 替身上跑 8 例（旧节点停留、面纱始终最后、旧视频立刻暂停、连续轮换不堆节点等）；`node --test` 共 16 例；`scripts/check.mjs` 加第 8 节 10 项静态校验

## 1.0.4 — 2026-10-05

- **npm 包里也能跑自检**：1.0.3 的自检第 7 节会校验 workflow YAML，但 npm 包里没有 `.github/`，从装好的包里跑 `node scripts/check.mjs` 会报 3 项失败。现在缺 `.github/` 时跳过（只查随包发布的 `examples/` 两份副本），并把 `test/` 加进 `files`——装完包也能 `npm test` 跑行为测试

## 1.0.3 — 2026-10-05

- **修 CI**：1.0.2 给 `check.yml` 加的行为测试步骤，名字里带了未加引号的 `": "`（`behavior tests (mock ctx: routes …)`），YAML 解析失败 → Actions `startup_failure`（有运行记录但没有任何 job）。步骤名已改，main 与 tag 上的 check 都恢复绿色
- **自检加防**：`scripts/check.mjs` 新增第 7 节，校验仓库里 4 个 workflow YAML 不含未加引号的 `": "`，本地跑一次就能拦住这类问题

## 1.0.2 — 2026-10-05

- **删除改为移入「废纸篓」**：`POST /wallpaper/delete` 优先 `rename` 到 `~/.Trash`（重名自动加时间戳后缀），跨卷 / 权限失败回退为真删；响应新增 `trashed` / `trashPath`，面板提示「已移到废纸篓」或「已永久删除」
- **视频省电暂停**：窗口不可见（`visibilitychange`）时暂停所有视频解码，回到前台自动续播；隐藏期间轮换不切新素材，回前台再补画（`pendingPaint`）
- **随机轮换**：state / config 新增 `shuffle`，面板「间隔」旁可勾选；`nextIndex()` 保证不会连续两次同一张
- **缩略图缓存 GC**：每次目录扫描顺带清理（10 分钟节流）孤儿缩略图，以及超过 1 小时的 `.scratch-*` 转码残留（保护正在转码的目录）；计数进 `/_hits` 的 `thumbGc`
- **行为测试**：新增 `test/host.test.mjs`（mock `ctx` + 真实 HTTP 路由），覆盖路由表、状态校验、HEAD/Range、路径穿越、回收站删除与跨卷回退、缩略图 GC；`npm test` = `node --test`，CI 与 `prepublishOnly` 都会跑

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