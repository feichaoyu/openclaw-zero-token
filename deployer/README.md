# OpenClaw 部署向导

可视化部署流程的跨平台桌面应用。

## 快速开始

### 1. 安装依赖

```bash
cd deployer
pnpm install
```

### 2. 启动应用

```bash
npm start
```

### 3. 打包应用

```bash
# macOS
pnpm run build:mac

# Windows
pnpm run build:win

# Linux
pnpm run build:linux

# 所有平台
pnpm run build:all
```

## 部署流程

应用会引导你完成 6 个部署步骤：

1. **构建项目** - 自动执行 `ppnpm install && pnpm build && pnpm ui:build`
2. **启动调试浏览器** - 启动 Chrome 调试模式
3. **登录平台** - 手动在浏览器中登录各 AI 平台
4. **配置认证** - 运行 onboard 向导捕获凭证
5. **登录 DeepSeek** - 手动登录 DeepSeek
6. **启动服务** - 启动 Gateway 服务

## 打包产物

- **macOS**: `dist/OpenClaw Deployer.dmg`
- **Windows**: `dist/OpenClaw Deployer Setup.exe`
- **Linux**: `dist/OpenClaw Deployer.AppImage`

## 系统要求

- Node.js >= 18
- pnpm >= 9.0.0
- Chrome 浏览器
