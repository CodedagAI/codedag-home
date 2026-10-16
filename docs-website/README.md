# codedag.com website

The source of [codedag.com](https://codedag.com): the homepage, pricing, policies and the CodeDAG documentation, built with [Next.js](https://nextjs.org) and [Fumadocs](https://fumadocs.dev).

## Run it locally

You need Node.js 22 and pnpm 10. Run these commands in this directory:

```bash
pnpm install       # install dependencies
pnpm dev           # start the dev server at http://localhost:3000
pnpm build         # production build
pnpm lint          # check links and lint the code
pnpm types:check   # type-check
```

pnpm switches to the version pinned in `package.json` by itself. The build scripts run with bun, which is a pinned dependency of the project, so you don't need to install it separately.

To try other settings locally, copy `.env.example` to `.env.local` and edit it.

If the dependencies get into a bad state, run `rm -rf node_modules .next .source && pnpm install`.

## Where things are

- `content/docs/`: the documentation. English pages are `*.mdx`, Chinese `*.zh.mdx` and Japanese `*.ja.mdx`.
- `content/policies/`: the terms, privacy policy and refund policy, in the same three languages.
- `app/`, `components/`, `lib/`: the website's code.

[AGENTS.md](./AGENTS.md) (in Chinese) describes the conventions for working on the site: routes, configuration and the MDX format.
