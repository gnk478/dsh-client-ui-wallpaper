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
| `POST /wallpaper/delete` | 删除素材（文件 + 缩略图 + 轮换项 + 记入跳过名单） |
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

## 文件与状态

| 路径 | 说明 |
|---|---|
| `~/.dsh/wallpapers` | 静态壁纸目录（config.imageDir） |
| `~/.dsh/videos` | 动态壁纸目录（config.videoDir） |
| `~/.dsh/wallpaper-state.json` | 运行时状态 |
| `~/.dsh/wallpaper-thumbs/` | 视频缩略图缓存 |
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
