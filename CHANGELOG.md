# 更新日志

## 1.1.7 — 2026-10-06

- **面板手选失效（修复）**：1.1.6 引入的 `modeAfterPick()` 被写在了 `apply()` 内部，而面板 `wallpaperSettingsElement()` 属于工厂作用域 —— 面板 onClick 闭包看不到它，点缩略图时同步抛 `Uncaught ReferenceError: modeAfterPick is not defined`，`save()` 从未执行，表现为「点任何壁纸都没反应」。现在函数提升回工厂作用域（面板闭包可见），并保留 1.1.6 的语义：轮换开着时手选只改「当前这一张」
- **手选优先显示（加固）**：三处手选（静态图缩略图 / 动态缩略图 / 「▶ 动态」按钮）都带上 `pick: "image" | "video"`（宿主 `POST /wallpaper/state` 校验并持久化，非法值 400），`load()` 读 `config.pick`，rotate 分支优先定位手选的那一类、`currentNode()` 用 `nodeFor()` 兜底 —— 修掉「轮换开着时手选静态图会被上次手选的视频盖住」，且只影响首帧，之后照常轮换
- **点击留痕**：新增 `panelPick { image, video, at, last }`，三处面板 onClick 在 `save()` 前调用 `notePick()`，经 `collect()` / `reportClient()` 进 `/_probe` 与 `/_client`；「点了没反应」时一眼能分清是点击没进来还是状态没生效
- **测试**：`test/rotate.test.mjs` +2 例（`pick: "image"` 压过遗留 `video`；`pick` 的素材不在库里时先画它）、`test/client.test.mjs` 切片标记改为工厂作用域的 `modeAfterPick`，`node --test` 共 54 例；`scripts/check.mjs` 第 14 节 +2 项（三个入口的 `notePick`、`panelPick` 上报）
## 1.1.6 — 2026-10-06

- **手选壁纸不再关掉自动轮换（修复）**：面板里点静态图缩略图 / 动态壁纸缩略图 / 「▶ 动态」按钮曾经硬编码 `mode: "image"` / `mode: "video"`，等于顺手把自动轮换关掉（1.1.1–1.1.5 一直如此）。现在统一走 `modeAfterPick(cfg.mode, fallback)`——轮换开着时手选只改「当前这一张」，`mode` 保持 `rotate`
- **选中的素材不在轮换列表里也先显示它**：rotate 分支用 `locateIndex()` 定位起始项（先看显式选的动态版，再看静态图），命中就从它开始；未命中（`offList`）时 `index` 保持 -1、先只画这一张，下一拍 `nextIndex(-1, …)` 回到列表开头。客户端 `load()` 改用库内全量 `library` 校验 `config.image`（不再限制在轮换池内），宿主 `lib/index.js` 同样改为 `current.images.includes(wanted)`
- **测试**：`test/rotate.test.mjs` +3 例（池外静态图 / 池外动态 / 动态优先）、`test/client.test.mjs` +3 例（`modeAfterPick`），`node --test` 共 52 例；`scripts/check.mjs` 加第 14 节 13 项

## 1.1.5 — 2026-10-06

- **选择器失效不再静默（新）**：客户端每 60 秒体检 8 组界面挂钩（输入框 / 侧栏 / 右栏 / 弹窗 / 气泡 / 工具栏 / 头像 / 代码块，每组带 `selectors` 与「该界面是否在场」的 `anchor`）。带锚点的组连续两轮匹配为 0 才判定失效（`strikes >= 2`，避开 React 渲染中途的假警报），此时 `console.warn("[dsh-wallpaper] UI 选择器失效：…")` + `noteError("selector-missing", …)`；恢复后清空 `warned`，再次失效会重新告警。`selectorHealth`（`at/checks/missing/detail/strikes`）经 `/_probe` 与 `/_client` 可读，`detail` 给出每组命中的那条选择器与匹配数
- **体检时机**：`load()` 里每个 60 秒周期一次（放在配置未变的早退检查之前），启动后 4 秒再补一轮——DSH 升级换掉类名后，最迟一分钟就有明确告警
- **测试**：新增 `test/client.test.mjs`（16 例：applyVars 3 / applyAutoInk 3 / classifyTile 2 / syncBlurFromState 4 / auditSelectors 4，全部抽真实源码 + 替身），`test/rotate.test.mjs` 加 1 条断言（每轮 `load()` 必须做一次体检）；`node --test` 共 46 例；`scripts/check.mjs` 加第 13 节 12 项（全库 123 项）

## 1.1.4 — 2026-10-06

- **修：50MB 预热阈值形同虚设**：1.1.2 引入的阈值靠 `HEAD` 响应头的 `content-length` 判断，但 GUI 的 `dsh-app://` 协议层读不到该响应头——线上实测 `prewarm.last.bytes` 恒为 `0`、`skipped` 恒为 `0`，196MB 的视频照样被预热。现在宿主在 `/wallpaper/list.json` 里直接返回 `sizes`（序列内每个素材 `stat` 出的字节数），客户端 60 秒一次的 `load()` 顺带刷新 `sizeCache`；抓不到大小时才回退 `HEAD`（兼容老宿主）
- **可见性**：`/_probe` 的 `prewarm.last.bytes` 现在能直接读出真实字节数（线上实测 16,554,373），阈值到底生效没有一眼可见
- **测试**：`test/rotate.test.mjs` 加 3 例（list.json 大小 → 超阈值只计数不建节点、小素材照常预热、无大小时 HEAD 兜底），`test/host.test.mjs` 加 1 例（`sizes` 来自宿主 stat）；`node --test` 共 30 例；`scripts/check.mjs` 加第 12 节 6 项

## 1.1.3 — 2026-10-06

- **修：1.1.1 / 1.1.2 轮换模式壁纸整块空白（严重）**：1.1.1 引入预热时，rotate 分支丢了 `var seconds = Number(config.rotateSeconds)`（含 15 秒下限、默认 600）与 `var index = 0` + 首帧定位循环，分支末尾也丢了 `return;`；`load()` 一进分支就读未声明的 `index` 抛 `ReferenceError`，又落进静默的 `.catch(function () {})` → 壁纸不再绘制且没有任何提示。现已恢复初始化与 `return;`
- **修：加载失败不再静默**：加载链异常记进 `loadFailure = { at, name, message }`，`/wallpaper/_probe` 与 `/wallpaper/_client` 都带；记录后立刻补发探针，下一次成功加载（`appliedSignature = signature`）后清空
- **测试**：新增 `test/rotate.test.mjs`（4 例，抽取真实 `load()` 源码 + 替身 fetch / 计时器）；指向坏的 1.1.2 源码时 4 例全红，修复后 `node --test` 共 26 例；`scripts/check.mjs` 加第 11 节 11 项

## 1.1.2 — 2026-10-06

- **探针实时化**：之前 `/_probe` 只在启动后 1.5 秒上报一次，`switches` 永远是初始值；现在每次切换后 0.6 秒（`scheduleProbe()`，防抖）重发一次，另有 60 秒心跳，`switches` / `layerDetail` / `audit` / `prewarm` 都保持最新
- **图层自愈**：`sweep()` 每 10 秒调 `auditLayer()`，除面纱与当前节点外、挂载超过 `AUDIT_GRACE_MS`（700 + 250ms）的节点一律回收并计数（`data-dsh-wp-mounted-at` 提供存活时长）；层内每个节点的 tag/来源/暂停/透明度/age 由 `mediaChildInfo()` 汇总进 `layerDetail`，用来定位是否真有未知路径在泄漏节点
- **预热阈值**：轮换预热前用 `HEAD` + `sizeCache` 问 `content-length`，超过 `PREWARM_MAX_BYTES = 50MB` 不建预热节点（库里最大视频 196MB）；隐藏窗口或预热未被使用时调 `discardWarmed()` 停解码、释放 src，`prewarmStats` 上报 warmed / skipped / dropped
- **测试**：`test/crossfade.test.mjs` 扩到 14 例（超龄陌生节点被回收、宽限期内不打断、无时间戳按超龄处理），`node --test` 共 22 例；`scripts/check.mjs` 加第 10 节 15 项

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