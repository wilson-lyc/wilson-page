# Wilson Personal Page

纯前端个人主页。目前包含响应式布局、导航与偏好设置，尚无正式内容。

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS v4
- shadcn/ui：Base UI、Nova、Neutral、Lucide
- ESLint + Prettier
- npm（依赖版本由 package-lock.json 锁定）

## 本地开发

```bash
npm ci
npm run dev
```

## 验证与构建

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

构建产物位于 `dist/`，可部署到静态托管服务。

## 项目约定

- `@/` 指向 `src/`。
- `src/App.tsx` 为 Header + Content 布局入口。
- 桌面端横向导航；小于 768px 使用可展开的手机菜单，支持 Escape 关闭。
- `#/` 与 `#/projects` 为 Home / Projects 路由，支持刷新和浏览器前进后退，适配静态托管。
- `src/lib/i18n.ts` 管理中英文文案；切换同步页面标题与 HTML lang。
- `src/hooks/use-preferences.ts` 管理语言与日夜主题，并通过 localStorage 保留偏好。
- 首次语言跟随浏览器，首次主题跟随系统；index.html 在首屏渲染前设置主题，减少闪烁。
- `src/index.css` 保存 Tailwind 与 shadcn 主题变量。
- `components.json` 保存 shadcn 配置。
- 基础交互与占位状态使用 shadcn Button、Empty 和 Separator。
- 后续添加组件前遵循 shadcn 技能，明确 registry 并查看组件文档。

## 全局配色

在 `src/index.css` 的 `:root`（日间）和 `.dark`（夜间）集中修改主题变量：

- `--primary` / `--primary-foreground`：主操作背景及其文字。当前使用 shadcn 默认中性色。
- `--accent` / `--accent-foreground`：导航激活、悬停及 Ghost 按钮的背景和文字。日间为浅灰背景、深色文字。
- `--background` / `--foreground`：页面背景和正文。
- `--muted` / `--muted-foreground`：弱化背景和次要文字。
- `--border` / `--input`：分隔线和输入框边框。
- `--ring`：键盘焦点，跟随主色。

页面及新增组件应使用 `bg-primary`、`bg-accent`、`text-foreground` 等语义颜色，不在各处单独写颜色值。Sidebar 配色复用主色和 accent。
