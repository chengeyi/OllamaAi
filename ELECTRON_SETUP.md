# Vue AI 聊天 - 桌面应用打包指南

## 概述

这个项目可以打包成一个独立的桌面应用程序（.app、.exe、.AppImage），使用 Electron + Vite + Express。

## 已完成的设置

### 1. 安装依赖
```bash
npm install -D electron electron-builder
```

### 2. 创建的文件

- `electron/main.ts` - Electron 主进程（窗口管理、IPC）
- `electron/preload.ts` - Electron Preload 脚本（安全通信）
- `electron-builder.yml` - 打包配置文件

### 3. 修改的文件

- `package.json` - 添加了 Electron 脚本和配置

## 运行开发版本（Electron）

### 方式 1：完整开发环境
```bash
npm run electron-dev
```
这会启动：
- ✅ Express 后端（localhost:3001）
- ✅ Vite 前端（localhost:5173）
- ✅ Electron 窗口

### 方式 2：仅 Electron（需要后端已运行）
```bash
npm run electron
```

## 打包为桌面应用

### macOS (.app)
```bash
npm run electron-build
```
输出：`dist_electron/Vue AI Chat-1.0.0.dmg`（可安装包）

### Windows (.exe)
```bash
npm run electron-build
```
输出：`dist_electron/Vue AI Chat Setup 1.0.0.exe`（安装程序）

### Linux (.AppImage)
```bash
npm run electron-build
```
输出：`dist_electron/Vue AI Chat-1.0.0.AppImage`

## 文件结构

```
vuwAi/
├── electron/
│   ├── main.ts          # Electron 主进程
│   └── preload.ts       # Preload 脚本
├── src/                 # Vue 前端代码
├── server.ts            # Express 后端
├── vite.config.ts       # Vite 配置
├── electron-builder.yml # 打包配置
└── package.json         # 依赖和脚本
```

## 工作原理

```
┌─────────────────────────────────────┐
│       Electron Main Process         │
│  - 创建窗口                         │
│  - 启动 Express 后端                 │
│  - 管理应用生命周期                 │
└─────────────────────────────────────┘
           ↓                ↓
    ┌────────────┐    ┌──────────┐
    │   Vite App │    │ Express  │
    │   (Vue UI) │←─→│ Backend  │
    │            │    │ (Ollama) │
    └────────────┘    └──────────┘
```

## 自定义应用信息

编辑 `electron-builder.yml`：

```yaml
appId: com.yourcompany.appname       # 应用 ID
productName: Your App Name           # 应用名称
```

编辑 `electron/main.ts` 中的窗口配置：

```typescript
mainWindow = new BrowserWindow({
  width: 1200,   // 窗口宽度
  height: 800,   // 窗口高度
  // ...
})
```

## 应用图标

### macOS
放置 512×512 PNG 到：`assets/icon.png`

### Windows
放置 256×256 ICO 到：`assets/icon.ico`

### Linux
放置 512×512 PNG 到：`assets/icon.png`

然后重新运行打包命令。

## 故障排除

### Electron 窗口不显示
- 确保 Vite 开发服务器正在运行
- 检查 `http://localhost:5173` 是否可访问

### 后端连接失败
- 确保 Express 服务器运行在 `localhost:3001`
- 检查 `.env` 中的配置

### 打包文件过大
默认包含了完整的 node_modules。如果要减小包体，可以：
1. 使用 `electron-builder` 的 `asarUnpack` 选项
2. 删除不必要的 devDependencies
3. 使用更小的 Ollama 模型

## 下一步

- [ ] 自定义应用图标
- [ ] 配置应用签名（发布时）
- [ ] 设置自动更新
- [ ] 优化包大小
- [ ] 添加应用菜单

## 参考资源

- [Electron 文档](https://www.electronjs.org/docs)
- [electron-builder](https://www.electron.build/)
- [Vite 指南](https://vitejs.dev/)
