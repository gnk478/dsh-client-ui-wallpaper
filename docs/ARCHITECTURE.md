# 架构与实现要点

## 两个半边

```
~/.dsh/profiles/<profile>/plugins/dsh-client-ui-wallpaper/
├── lib/index.js     宿主（Node，cordis 插件）：文件服务 + 状态 + 抽帧 + 同步 + 删除
└── lib/client.js    客户端（浏览器）：注入样式 + 铺背景 + 面板 UI + 墨水判定
```

挂载：profile 的 `cordis.patch.yml` 里 `- insert: - id: ui-wallpaper name: ./plugins/dsh-client-ui-wallpaper/lib/index.js`；宿主路由全挂在 `/wallpaper/*`。

## 宿主路由

| 路由 | 作用 |
|---|---|
| `GET /wallpaper/list.json` | 目录扫描结果（images/videos/library/pool/sequence/liveMap/config） |
| `GET·POST /wallpaper/state` | 读/写状态（mode、image、video、rotation、blur、panelOpacity、sidebarOpacity、autoInk、autoInclude…） |
| `GET /wallpaper/file/<name>` | 送壁纸文件（支持 Range） |
| `GET /wallpaper/thumb/<name>` | 视频缩略图：`qlmanage -t -s 480` 抽帧后落盘缓存 |
| `POST /wallpaper/sync` | 从 Dynamic Wallpaper.app 播放列表同步素材 |
| `POST /wallpaper/delete` | 删除素材：移入 `~/.Trash`（跨卷回退硬删，响应带 `trashed`/`trashPath`）+ 缩略图 + 轮换项 + 记入跳过名单 |
| `GET /wallpaper/_client` | 客户端上报的自检快照（ink/探针/面板状态/lastError） |
| `GET /wallpaper/_hits` | 各路由请求计数 |
| `POST /wallpaper/_probe` | 外部注入探针数据 |

## 客户端注入的样式常量（顺序即优先级）

```
CSS + WINDOW_CSS + BLUR_CSS + SIDEBAR_LEFT_CSS + SIDEBAR_CSS + PANEL_CSS
    + NUMBER_CSS + INK_CSS + INK_LIGHT_CSS + CODE_CSS + CODEFIX_CSS
    + BUBBLE_CSS + COMPOSER_CSS + SURFACE_CSS
```

- `WINDOW_CSS`：把 `html/body/#root/_frame/_centerCol` 等大容器透明，壁纸层 `#dsh-wallpaper-layer` 铺满
- `SIDEBAR_LEFT_CSS`：左栏固定透明（保持原观感）；`SIDEBAR_CSS`：**右栏**由 `--dsh-wp-sidebar` 驱动
- `CODE_CSS` / `CODEFIX_CSS`：代码块按外观取底色与字色
- `SURFACE_CSS`：设置弹窗内 token 复位为外观原值

关键机制：

- **亮度采样**：`lumaBehind(el)` 用 16×8 canvas 按 `object-fit: cover` 把元素矩形映射到壁纸图求平均亮度；`effectiveLuma(el)` 先看元素自身背景是否不透明，再回退到壁纸
- **透明化扫描**：每 3 秒给面积 > 窗口 35% 且带实色背景的大面板打 `data-dsh-wp-clear` 强制透明；**跳过**弹窗/菜单，并跳过右栏（它要能调透明度）
- **自动对比**：`applyAutoInk()` 只处理自带背景的气泡/工具栏等；打标键 = 外观 epoch + 元素背景色，避免旧色滞留
- **缓存**：面板数据 `panelDataCache` / `panelCfgCache`；视频帧缓存放 `window.__dshWpVideoFrames` + sessionStorage（客户端热替换会重置模块级变量）
- **轮换与省电**：轮换取下一项走 `nextIndex()`（state `shuffle` 为真时随机且不重复当前项）；`document.visibilitychange` → `setPlayback()` 暂停/续播所有 `<video>`，隐藏期间只记 `pendingPaint`、回前台再补画
- **交叉淡入淡出（crossfade）**：换壁纸时新节点 `data-dsh-wp-current` 插到常驻 `.dsh-wallpaper-scrim` 之前（面纱必须始终是最后一个子元素），旧节点留在下层由 `paint()` 给新节点加 `opacity 0 → 1`（`FADE_MS = 700`、`ease-out`）过渡，`FADE_MS + 80` 后 `retire()` 暂停并移除旧节点；`currentMedia()` 统一按当前节点取色，避免旧图层让自动字色闪错；首次绘制、重绘同一节点、`document.hidden`、`prefers-reduced-motion: reduce` 都直接替换
- **手选不打断轮换（1.1.6）**：`modeAfterPick(currentMode, fallback)` 让面板手选（静态图缩略图 / 动态缩略图 / 「▶ 动态」按钮）在 `mode === "rotate"` 时保持 `rotate`，只更新 `image` / `video`；`load()` 的 rotate 分支用 `locateIndex()` 定位起始项（先显式 `video` 再 `image`），池外素材（`offList`）时 `index` 保持 -1、先画它、下一拍从列表头继续，这一帧的节点由 `currentNode()` 决定（`paint` / `paintNext` 都改走它）；客户端 `load()` 用库内全量 `library` 校验 `config.image`，宿主 `lib/index.js` 用 `current.images.includes(wanted)`，两处都不再把手选图替换成轮换池首项。回归：`test/rotate.test.mjs` 3 例 + `test/client.test.mjs` 3 例，`check.mjs` 第 14 节
- **选择器静默失效告警（1.1.5）**：`UI_SELECTORS` 列出 8 组界面挂钩（composer / sidebar / rightbar / dialog / bubble / toolbar / avatar / code，每项 `{ id, label, selectors[], anchor }`；`anchor` 是「该界面是否在场」的判据，为 `null` 的组缺席属正常）。`auditSelectors()` 在 `load()` 的每个 60 秒周期跑一次（放在 `appliedSignature` 早退**之前**），启动后 4 秒再补一轮；带锚点且 `matched === 0` 的组必须连续两轮（`strikes >= 2`）才计进 `missing`——避开 React 渲染中途的假警报，中间命中一次就把 strikes 归零。出现新签名时触发一次 `console.warn("[dsh-wallpaper] UI 选择器失效：…")` 与 `noteError("selector-missing", …)`；`signature` 为空（恢复）时清空 `warned`，因此同一组再次失效会重新告警。`selectorHealth` 经 `collect()` 进 `/_probe`、经 `reportClient()` 进 `/_client`，`detail` 记录每组命中的那条选择器与匹配数；`test/client.test.mjs` 用真实源码 + 替身覆盖「两轮才告警 / 恢复后重新告警 / 锚点缺席不算失效 / 命中时记明细」
- **预热大小来源（1.1.4）**：宿主在 `/wallpaper/list.json` 里返回 `sizes`（序列内每个素材 `stat` 出的字节数），客户端 `load()`（60 秒一次）用它填 `sizeCache`；只有查不到大小才回退 `HEAD`。原因：GUI 走 `dsh-app://` 协议，`HEAD` 响应里读不到 `content-length`，线上实测 `prewarm.last.bytes` 恒为 0、50MB 阈值形同虚设
- **加载路径留痕（1.1.3）**：`load()` 不再静默吞错——rotate 分支开头完成初始化（`var seconds = Number(config.rotateSeconds)` 并把 15 秒以下 clamp 成 600、`var index = 0` 加首帧定位 for 循环），分支末尾 `return;` 不再落到 image/video 分支重复画；链上任何异常写进 `loadFailure = { at, name, message }`（`/_probe` 与 `/_client` 都带），下一次成功加载（`appliedSignature = signature`）后清空。`test/rotate.test.mjs` 用真实 `load()` 源码 + 替身 fetch 覆盖这 4 条不变量，防「壁纸整块空白且无提示」回归
- **探针实时化与图层自愈（1.1.2）**：`noteSwitch()` 结束时调 `scheduleProbe()`（`PROBE_DEBOUNCE_MS = 600` 防抖）把 `/_probe` 立刻重发一次，`apply()` 另挂 `PROBE_PERIOD_MS = 60000` 心跳；`sweep()`（10 秒一轮）里跑 `auditLayer()`——`paint()` 给每个挂上的节点写 `data-dsh-wp-mounted-at`，除面纱与当前节点外，任何挂载超过 `AUDIT_GRACE_MS = FADE_MS + 250` 的节点都被 `retire()` 回收并计入 `layerAudit`；`mediaChildInfo()` 把层内每个节点的 tag/文件名/是否当前/暂停/透明度/存活时长汇总成 `layerDetail`（`/_probe` 与 `/_client` 都带）。轮换预热先 `mediaSize()`（`HEAD` + `sizeCache`）问大小，超过 `PREWARM_MAX_BYTES = 50MB` 只记 `prewarmStats.skipped` 不建节点；被跳过的预热节点由 `discardWarmed()` 停解码并释放
- **首帧就绪再淡入（1.1.1）**：淡入前先看 `frameReady()`（视频 `readyState >= 2`、图片 `complete && naturalWidth > 0`），未就绪则由 `whenFrame()` 监听 `loadeddata` / `load` / `error` 并以 `READY_MS = 600` 兜底再淡；`paint()` 用 `paintSeq` 序号守卫被打断的等待回调，`settle()` 回收除面纱与当前节点以外的全部媒体节点（修掉旧节点以 `opacity:1` 卡在层里的问题）；`switchStats` 经 `/_probe` 的 `switches` 暴露 fade / waited / instant* 与 `lastReason`；轮换模式在切换前 8 秒用 `preload = "auto"` 预建下一项预热（预热节点带 `dshWpPrewarm` 标记、不抢播）

## 文件与状态

| 路径 | 说明 |
|---|---|
| Dynamic Wallpaper.app 素材库的 `Wallpaper/` | 静态壁纸目录（config.imageDir 默认值，见 `lib/index.js:37-39`） |
| Dynamic Wallpaper.app 素材库的 `Videos/` | 动态壁纸目录（config.videoDir 默认值）；config 里写**绝对路径**才会生效，插件不做 `~` 展开 |
| `~/.dsh/wallpaper-state.json` | 运行时状态 |
| `~/.dsh/wallpaper-thumbs/` | 视频缩略图缓存；每次目录扫描顺带 GC（10 分钟节流）：删孤儿缩略图与超过 1 小时的 `.scratch-*` 转码残留，计数进 `/_hits` 的 `thumbGc` |
| `~/.dsh/wallpaper-sync-skip.txt` | 同步跳过名单（删过的素材写这里，避免被同步拉回） |

## 踩坑记录（改之前先看这里）

1. **`pre.shiki` 背景透明** → 按壁纸亮度判定会给代码块配错字色。结论：代码块只跟外观走。
2. **侧栏透明度「改了没生效」** → 透明化扫描把侧栏底色清成 transparent，改 token 看不出来。修：扫描跳过目标栏 + 直接写 `background-color`。
3. **右侧栏 ≠ 左侧栏**：目标是 `_6Qf49G_rightbarCol`，左栏是 `_6Qf49G_sidebarCol`。
4. **macOS 上侧栏有 darwin 渐变混色** → 用更高特异度 + `!important` 直接给 `background-color`，0–100% 才线性。
5. **客户端热替换会重置模块级缓存** → 跨次保留的数据放 `window` / sessionStorage。
6. **面板每次打开都重建** → 加数据缓存，并改用宿主预生成缩略图（不再新建 `<video>`）。
7. **DSH 运行中会用内存配置回写 profile 文件** → 手工改 `cordis.patch.yml` / `.credentials.yaml` 可能被覆盖；安装脚本会备份并提示。
8. **函数定义了没调用 / 作用域写错** 会静默失败 → 关键路径挂自检字段，用 `/wallpaper/_client` 读回来确认。

## 自检

```bash
node scripts/check.mjs
curl -s http://127.0.0.1:19387/wallpaper/_client | python3 -m json.tool | head -40
```
