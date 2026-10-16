import { createMdxPlugin } from 'fumadocs-mdx/bun';
import { postInstall } from 'fumadocs-mdx/next';

// `.source/` is shared with `next dev`, whose MDX loader reads the compiled config from it.
// Generate it from the site config (source.config.ts): writing the script config there
// drops the rehype plugins from the running dev server (no code highlighting).
await postInstall({ configPath: 'source.config.ts' });
// The script config (no rehype plugins, faster) only drives in-process compilation.
// The plugin's setup is async: without the await, the .mdx imports in .source/server.ts can be
// loaded before it finishes and bypass the plugin ("Export named 'frontmatter' not found").
await Bun.plugin(createMdxPlugin({ configPath: 'source.script.ts' }));
