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

## 构建检查

```bash
npm run build
```
