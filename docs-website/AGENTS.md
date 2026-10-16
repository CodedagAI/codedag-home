# docs-website 开发指南

本文件为在本目录中进行开发时提供指引，主要面向站点开发：技术栈、路由、配置，以及 MDX 的格式规范。

## 技术栈

- **Next.js 16.3.8** + **FumaDocs**（fumadocs-core、fumadocs-mdx、fumadocs-ui、fumadocs-openapi）
- **Tailwind CSS v4**（使用 `@tailwindcss/postcss`）
- **pnpm 10.24.0** 管理依赖（`package.json` 的 `packageManager` 字段固定），**bun 1.4.3** 运行构建与检查脚本：bun 是固定版本的开发依赖，scripts 调用 `./node_modules/.bin/bun`，与本机全局安装的 bun 无关
- **React 19.3.0**、**TypeScript**、**Zod v4**
- **Orama** 搜索索引（post-build 阶段生成）
- **Shiki** 代码高亮（catppuccin-latte / catppuccin-mocha 主题）

## 开发命令

所有命令在本目录下执行：

```bash
pnpm install          # 安装依赖
pnpm dev              # 启动开发服务器，访问 http://localhost:3000
pnpm build            # 完整构建（pre-build → next build → post-build）
pnpm types:check      # 类型检查（fumadocs-mdx → next typegen → tsc）
pnpm lint             # 代码检查（fumadocs-mdx → 自定义 lint 脚本 → eslint）
pnpm clean            # 清除 .next/
```

构建流程：`pre-build`（生成组件 registry）→ `next build` → `post-build`（更新 Orama 搜索索引）。

依赖损坏时：`rm -rf node_modules .next .source && pnpm install`

## 关键配置文件

| 文件 | 用途 |
|------|------|
| `next.config.ts` | Next.js 配置（MDX 集成、重写、重定向等） |
| `source.config.ts` | FumaDocs 内容源配置（docs、blog、policies 集合，Shiki 主题、rehype 插件等） |
| `proxy.ts` | i18n 路由代理（Next.js 16 替代 middleware.ts） |
| `app/global.css` | 全局样式（Tailwind v4 + FumaDocs UI） |
| `app/home.css` | 首页与定价页的样式：页面文字色、随主题变化的“舞台”及其中各个画面的动画；首页用到的颜色都定义成这里的变量，浅色与深色主题各一套；由 `global.css` 引入 |
| `mdx-components.tsx` | MDX 自定义组件映射 |
| `lib/i18n.ts` | 国际化配置（en、zh、ja） |
| `lib/config.ts` | 站点配置（基础 URL、站点名称、支持的语言、对外邮箱的域名、Waitlist 表单 ID） |
| `lib/site-mode.ts` | 主页模式（`waitlist`、`beta`、`live`）与登录、开始使用、订阅三类入口；页面和组件里的入口都从这里取，不直接写 App 地址或 Waitlist 地址 |
| `lib/policies.ts` | 条款、隐私政策、退款政策三份政策页共用的法定名称、生效日期和各自的联系邮箱，页脚版权行也从这里取法定名称。政策正文在 `content/policies/`，英文为基准、中日由英文译出，三种语言同步修改；正文不写日期，页首的生效日期只在这里改 |
| `components/analytics.tsx` | Vercel Web Analytics，挂在根布局里；只在 `codedag.com` 上报（本地开发是调试模式，只在控制台打印），预览部署和 fork 都不上报；点击事件只带入口位置 `source`，不带个人信息 |
| `.env.production` | 入库的生产环境变量，只放 `NEXT_PUBLIC_SITE_MODE`；切换主页模式就是改这一行。本地覆盖写在不入库的 `.env.local`，变量说明见 `.env.example` |

## 架构

### i18n 路由（重要）

- **支持语言**：en（默认）、zh、ja
- **Next.js 16 使用 `proxy.ts` 替代 `middleware.ts`** — 禁止创建 `middleware.ts`。如需修改路由，编辑 `proxy.ts`。
- URL 规则：`/docs/...`（英文，无前缀）、`/zh/docs/...`（中文）、`/ja/docs/...`（日文）
- 访问 `/en/...` 会故意返回 404（默认语言不带前缀）

### 内容源（fumadocs-mdx）

- `source.config.ts` — 定义三个集合：**docs**（来自 `content/docs/`）、**blog**（来自 `content/blog/`）和 **policies**（来自 `content/policies/`，三份政策页的正文，由 `app/[lang]/(home)/components/policy-page.tsx` 渲染）
- `lib/source.tsx` — 通过 `fumadocs-core/source` loader 加载文档 + OpenAPI 规范，应用 i18n 和 lucide 图标插件
- 多语言文件使用后缀约定：`overview.mdx`（en）、`overview.zh.mdx`（zh）、`overview.ja.mdx`（ja）
- 导航结构通过每个目录下的 `meta.json` / `meta.zh.json` 定义
- `.source/` 目录由 fumadocs-mdx 自动生成，无需手动管理

### App Router 路由布局

```
app/
├── [lang]/
│   ├── layout.tsx         # 根布局：输出 <html lang> 按当前语言（en、zh-CN、ja），没有 app/layout.tsx；TreeContextProvider + I18nProvider + Navbar + Footer
│   ├── (home)/
│   │   ├── page.tsx       # 首页
│   │   ├── pricing/       # 定价页
│   │   ├── docs/          # /docs 跳到当前语言的概览页
│   │   ├── blog/          # 博客列表、[slug] 文章页与 RSS；没有文章时三者都返回 404
│   │   ├── [...slug]/     # 兜底路由：未匹配的地址返回 404
│   │   └── ...
│   ├── docs/
│   │   ├── layout.tsx     # 文档侧边栏布局
│   │   └── [...slug]/     # 文档页面
│   └── not-found.tsx
├── api/                   # API 路由
├── llms.mdx/              # LLM 友好的 Markdown 端点
├── og/                    # Open Graph 图片生成
└── sitemap.ts, robots.ts
```

### 翻译体系

- **UI 翻译**：`lib/translations.ts`（导航栏、页脚、侧边栏、404 页面）+ 页面级文件（`lib/pricing-translations.ts`、`lib/blog-translations.ts`、`lib/homepage-translations.ts`）
- **内容翻译**：通过语言后缀的 MDX 文件（`.zh.mdx`、`.ja.mdx`）
- MDX 中的代码注释也需要多语言翻译

## MDX 格式规范

在 `content/` 中写内容时，遵循以下规则。

### meta 信息

#### icon

只能用 lucide 基础名称，如 `FileBraces`，不能用别名，如 `FileJson`，否则会报错。这是由于 `lucideIconsPlugin` 的支持不完善导致的。
现在的解决方案是，继续使用原有 `lucideIconsPlugin`，同时约束开发行为，保证所有 icon 都使用 lucide 基础名称。
如果未来一定要使用别名，可考虑自定义插件。

### 标题与锚点

- 不写 `#` 一级标题，页面标题来自 frontmatter 的 `title`。正文顶级标题用 `##`，小节用 `###`，尽量不用 `####`。
- 自定义锚点写在标题末尾：`## 标题 [#anchor-id]`。站内链接与 CLI 报错都按锚点定位：已有锚点改名、删除或移到别的页面之后，同步更新引用它的地方，包括各语言文档里的站内链接，以及产品仓库 `src/utils/doc-links.ts` 中登记的 CLI 文档链接。
- 标题带 `1. ` 这样的数字前缀会渲染成步骤组，见[步骤格式](#步骤格式)；不是步骤的标题不要加数字编号。

### 正文中的转义与陷阱

MDX 把正文当 JSX 解析，以下几处会导致编译失败或渲染错位：

- `<` 后面紧跟字母或 `/` 会被当成标签，`{`、`}` 会被当成表达式。占位符优先写在行内代码里（`` `cdg dag submit <工作流>` ``）；必须出现在普通正文时写 `&lt;` 和 `\{`。
- 表格单元格里的行内代码含 `|` 时写成 `\|`。
- 正文里的美元符号写成 `\$`。站点启用了数学公式，同一段里的两个 `$` 会配成一对，中间的文字被当成行内公式渲染：这两个 `$` 不再显示，夹在中间的中文还会触发 KaTeX 的 `unicodeTextInMathMode` 警告。行内代码和代码块里的 `$` 保持原样。
- JSX 组件属性里只用 ASCII 引号，不要用中文引号。
- MDX 注释写 `{/* … */}`，不要用 HTML 注释。注释是写给作者的备注，不会出现在站点上；一条注释单独占一对花括号，不和其他表达式写在一起。

### 标点与事实

- 正文引号统一用中文弯引号 “ ”，不用「」。代码块、行内代码与 JSX 属性里的 ASCII 引号保持不变。
- 终端输出示例必须来自真实格式，不编造数字、时间与版本号。拿不准的输出改用文字描述，或只给最小片段并加 `{/* TODO(核对): 原因 */}`。

### 代码格式

#### 文案要求

代码内的注释与文案也需注意多语言翻译。

对于 CodeDAG 特有的命令，必须以 `cdg` 或 `codedag` 开头，不要省略。

#### 行内代码格式

- 行内代码高亮：`cdg dag submit{:sh}`，其中 `{sh}` 为语言类型。
- `{:sh}` 只用于命令。字段名、状态、原因码、路径与文件名用普通反引号。

#### 代码块格式

- 终端命令/终端输出：```bash title="Terminal"（npm 或类似 js/ts 包安装命令除外，会自动处理。输出也用 bash 类型，不要用 text 类型。）
- 日志文件内容：```log title="log"
- 交给 Agent 的提示词：```text title="提示词"（提示词不是终端输出，用 text 类型；纯文本与 Markdown 类型的代码块默认自动换行，其他类型默认横向滚动，读者可用代码块右上角的开关切换）
- 指定目录：```json title=".codedag/settings.json"
- 指定文件：```yaml title="example.yaml"
- 仅知类型：```sh title="sh"（title 用文件后缀，通常小写）
- 多标签组：
```yaml tab="yaml"
```
```json tab="json"
```
- 行高亮：`// [!code highlight]`
- Diff 样式：`// [!code --]` 删除行，`// [!code ++]` 新增行

### Mermaid 图表

```mdx
export const exampleChart = `
example
mermaid
code`;

<Tabs items={['图表', '代码']}>
  <Tab value="图表">
    <Mermaid chart={exampleChart} />
  </Tab>
  <Tab value="代码">
    <DynamicCodeBlock lang="mermaid" code={exampleChart}
      options={{
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha',
        },
      }}
    />
  </Tab>
</Tabs>
```

图表变量先在正文任意位置用 `export const` 声明，再按上面的固定结构引用：

- 变量名用 camelCase 并以 `Chart` 结尾，同一页内不重名。
- 模板字符串内不要出现反引号与 `${`。
- DAG 形状用 `flowchart LR`，状态机用 `stateDiagram-v2`。节点文字用中文或任务标题，节点 ID 用 `t1`、`t2`。
- `<Tabs items={[...]}>` 的 `items` 与各 `<Tab value="...">` 必须逐字一致，否则标签页不显示。
- 节点文字只在 `<br/>` 处换行：`components/mdx/mermaid.tsx` 把 Mermaid 的自动换行宽度从 200px 放宽到 360px，一行较长时在语义停顿处手动断开。连线文字与子图标题不受这项配置影响，超过 200px 仍会自动折行：连线文字同样用 `<br/>` 断行；子图标题折出的第二行会被节点挡住，要写短到一行以内（约 12 个全角字符或 25 个英文字母）。时序图里的消息、备注和 `opt`、`loop` 标签也用 `<br/>` 断行。
- 图表比正文栏（约 800px）宽时会整体缩小，文字跟着变小。译文通常比中文长，各语言版本改完后都在浏览器里对照一遍：过宽时先断行或缩短文字，仍不够再在图表首行加 `%%{init: {"flowchart": {"padding": 10, "rankSpacing": 28}}}%%` 这样的指令收紧间距，三种语言用同一行指令。

### 步骤格式

使用 Markdown 标题加数字，自动渲染为步骤样式：连续的同级标题写成 `## 1. 初始化项目`、`## 2. 编写工作流文件`，匹配 `^\d+\.\s` 的标题会被归入同一个步骤组。步骤组内可以有 `###` 小节。

非步骤说明，不要在标题里加数字列表格式。可直接使用非列表标题，或者使用简单的有序列表（非标题）。

### 多语言链接

文档内的链接需要指向对应语言的路径：
- 英文文档（`.mdx`）：使用 `/docs/...` 路径，如 `[Installation](/docs/get-started/installation)`
- 中文文档（`.zh.mdx`）：使用 `/zh/docs/...` 路径，如 `[安装](/zh/docs/get-started/installation)`

链接里不写 `index` 段：CLI 总览写 `/zh/docs/reference/cli`。发布说明直接链接到具体版本，如 `/zh/docs/release-notes/0.1.0`。

### 邮箱地址

正文里不直接写邮箱地址，也不写 `mailto:` 链接，用 `<Email user="hi" />`：`user` 是 @ 前面的名字（`hi`、`legal`、`privacy`），域名由组件补上。页面上显示的是普通的邮件链接，HTML 源码里是字符实体。组件前后要有别的文字，不要让它独占一行。

### 提示框 (Callout)

```mdx
<Callout>默认 info 类型</Callout>
<Callout type="warn" title="警告">警告内容</Callout>
```

类型：`info`（默认）、`warn`、`error`、`success`、`idea`

### 卡片 (Cards)

```mdx
<Cards>
  <Card href="/docs/get-started/quickstart" title="快速开始">描述文字</Card>
  <Card icon={<Rocket />} title="带图标">需先 import 图标</Card>
</Cards>
```

### 目录树 (Files)

```mdx
<Files>
  <Folder name=".codedag" defaultOpen>
    <File name="settings.jsonc" />
    <Folder name="dags">
      <File name="first-run.yaml" />
    </Folder>
  </Folder>
</Files>
```

### 下拉组 (Accordion)

适用于 FAQ 等场景。`type="single"` 仅展开一个，`type="multiple"` 可展开多个。

```mdx
<Accordions type="single">
  <Accordion title="问题一">答案内容</Accordion>
  <Accordion title="问题二">答案内容</Accordion>
</Accordions>
```

## Tailwind 类名与 TypeScript 配置

编辑器的 Tailwind 插件会提示可以写成规范形式的类名（`suggestCanonicalClasses`），编辑器里的 TypeScript 6 会对弃用的配置项报错。下面这些写法直接用规范形式。

### Tailwind 类名

能用标准类就不写任意值：

| 不写 | 写成 | 说明 |
|---|---|---|
| `max-w-[44rem]`、`size-[2.625rem]` | `max-w-176`、`size-10.5` | 间距和尺寸用间距刻度，数字是 rem 值乘 4 |
| `max-w-[240px]` | `max-w-60` | px 值落在常用档位上时同样换算；`max-w-[800px]` 这类插件不提示的保留原样 |
| `dark:border-white/[0.08]` | `dark:border-white/8` | 透明度写成百分数 |
| `aspect-[4/3]` | `aspect-4/3` | |
| `leading-[1.5]` | `leading-normal` | 有命名值时用命名值 |
| `!my-0` | `my-0!` | important 标记写在末尾 |
| `data-[highlighted]:` | `data-highlighted:` | 只判断属性存在时不加方括号 |
| `bg-gradient-to-t` | `bg-linear-to-t` | v4 的新名字 |
| `[&:has([role=checkbox])]:pr-0` | `has-[[role=checkbox]]:pr-0` | 有现成变体时不写任意选择器 |

- 插件只在生成的 CSS 与原写法相同时才提示，照改一般不影响外观。插件不提示的不要硬换：`text-[0.75rem]` 不等于 `text-xs`，后者还会设置行高。
- **颜色提示要先核对：** 插件拿 `@theme` 里的值比对，不知道 `app/global.css` 在 `.dark` 里给 `brand` 系列颜色另设了一套值。提示把任意色值换成某个 `brand` 颜色时，换过去的颜色在深色主题下会跟着变，只有本来就该随主题变化时才照改。`dark:` 变体里要的是固定颜色时，找 `.dark` 下值相同的颜色：深色主题的 `--color-brand` 是 `hsl(258, 100%, 76%)`，所以 `dark:text-[hsl(258,100%,76%)]` 写成 `dark:text-brand`，不写成插件提示的 `dark:text-brand-200`。找不到值相同的颜色就保留任意值，这条提示忽略，如博客筛选按钮的 `dark:text-[hsl(258,100%,80%)]`。

## 关键约定

- 文档中涉及 CodeDAG 的 CLI 命令必须以 `cdg` 或 `codedag` 开头，不得省略前缀
- **禁止创建 `middleware.ts`**，路由统一由 `proxy.ts` 处理
- 改动 Next.js 的接口或配置前，先查 `node_modules/next/dist/docs/` 里对应版本的文档，不凭旧版的印象写：Next 16 的不少接口和默认行为与旧版不同。`next.config.ts` 设了 `agentRules: false`，`next dev` 不会再往本文件末尾追加 Next.js 自动生成的同类提示
- 页面、文案和 MDX 里都不写完整的邮箱地址：一律经 `components/email.tsx` 的 `Email` 组件输出，它把地址和链接写成字符实体，HTML 源码里搜不到明文。页脚不放邮箱地址

## 常见问题

- 依赖报错 → 按上文“依赖损坏时”的命令重装；保留 `pnpm-lock.yaml`，发布构建用 `pnpm install --frozen-lockfile` 按它安装
- 构建错误 → 检查 `source.config.ts` 和 `next.config.ts` 配置
- 类型错误 → 先运行 `pnpm types:check` 定位问题
