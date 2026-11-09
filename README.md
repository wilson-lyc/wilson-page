# Wilson Personal Page

使用 React、TypeScript 和 Vite 构建的个人主页，支持中英文、日夜主题和响应式布局。

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

## 部署

支持推送到 `main` 后通过 GitHub Actions 自动构建并部署。配置说明及 1Panel 手动部署步骤见 [部署文档](./DEPLOYMENT.md)。

## 本地验证

```bash
npm run typecheck
npm run lint
npm run build
```

## 项目约定

- `@/` 指向 `src/`。
- `src/App.tsx` 为 Header + Content 布局入口。
- 桌面端横向导航；小于 768px 使用可展开的手机菜单，支持 Escape 关闭。
- `#/` 与 `#/projects` 为 Home / Projects 路由，支持刷新和浏览器前进后退，适配静态托管。
- `src/lib/i18n.ts` 管理中英文文案；切换同步页面标题与 HTML lang。
- `src/hooks/use-preferences.ts` 管理语言与日夜主题，切换仅在当前页面生效，不存储偏好。
- 每次打开默认英文，主题默认跟随系统；index.html 在首屏渲染前设置主题，减少闪烁。
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
