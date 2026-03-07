# Resume Template Builder

基于 React + TypeScript + Vite 的简历模板编辑器。

## 功能

- 左侧编辑、右侧实时渲染预览
- 简历数据抽象为统一 JSON
- 支持模块增删（简介/工作/教育/技能）
- 工作经历支持项目列表增删与编辑
- 支持模板（Classic/Modern）与主题（Ocean/Forest/Sunset）切换
- 模板采用注册表机制，可按插件方式扩展（已内置 Classic/Modern/Compact）
- 支持浏览器打印导出 PDF
- 支持简历 JSON 导入/导出
- 支持本地存储持久化（刷新后自动恢复）

## 启动

```bash
npm install
npm run dev
```

## 桌面端（Tauri）

```bash
# 开发模式（桌面窗口 + 前端热更新）
npm run tauri:dev

# 打包桌面应用
npm run tauri:build
```

## 本地数据存储

- 当前已使用 Tauri 本地文件存储，不再依赖前端 `localStorage`
- 数据文件：应用本地目录下 `resume_state.json`
- 存储结构已预留扩展区：
  - `pageSettings`（页面设置）
  - `pluginSettings`（插件配置）
  - `pageConfigs`（页面配置）

## 构建检查

```bash
npm run build
```
