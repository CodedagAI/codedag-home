import {
  defineCollections,
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';
import type { ElementContent } from 'hast';
import jsonSchema from 'fumadocs-mdx/plugins/json-schema';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import type { ShikiTransformer } from 'shiki';
import { wrapsByDefault } from './lib/code-wrap';

export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema.extend({
      preview: z.string().optional(),
      index: z.boolean().default(false),
      /**
       * API routes only
       */
      method: z.string().optional(),
    }),
    postprocess: {
      includeProcessedMarkdown: true,
      extractLinkReferences: true,
    },
    async: true,
  },
  meta: {
    schema: metaSchema.extend({
      description: z.string().optional(),
    }),
  },
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    author: z.string(),
    date: z.iso.date().or(z.date()),
    category: z
      .enum([
        'Engineering',
        'Product',
        'Tutorials',
        'Deep Dives',
        'Announcements',
      ])
      .default('Announcements'),
    featured: z.boolean().default(false),
    image: z.string().optional(),
    authorAvatar: z.string().optional(),
  }),
  async: true,
});

/**
 * 政策页正文：条款、隐私政策、退款政策，每份三种语言（terms.mdx、terms.zh.mdx、terms.ja.mdx）。
 * 页首的法定名称、生效日期和联系邮箱不写在正文里，统一取自 lib/policies.ts
 */
export const policies = defineCollections({
  type: 'doc',
  dir: 'content/policies',
  schema: frontmatterSchema,
});

function transformerEscape(): ShikiTransformer {
  return {
    name: '@shikijs/transformers:remove-notation-escape',
    code(hast) {
      function replace(node: ElementContent) {
        if (node.type === 'text') {
          node.value = node.value.replace('[\\!code', '[!code');
        } else if ('children' in node) {
          for (const child of node.children) {
            replace(child);
          }
        }
      }

      replace(hast);
      return hast;
    },
  };
}

// Prose-like blocks (prompts, Markdown) start with long lines wrapped instead of scrolling
// sideways. `data-wrap` is the initial state of the toggle in components/mdx/code-block.tsx.
function transformerDefaultWrap(): ShikiTransformer {
  return {
    name: 'codedag:default-wrap',
    pre(hast) {
      if (wrapsByDefault(this.options.lang)) {
        hast.properties['data-wrap'] = true;
      }
    },
  };
}

// Default types from fumadocs-core remark-structure (not exported in npm package)
const remarkStructureDefaultTypes = [
  'heading',
  'paragraph',
  'blockquote',
  'tableCell',
  'mdxJsxFlowElement',
];

// Custom code block icons for yaml, json, mdx
// 三个图标取自 react-symbols（https://github.com/pheralb/react-symbols，可在 https://react-symbols.vercel.app/ 查找）：
// json 是 BracketsOrange，yaml 是 Yaml，mdx 是 MarkdownX。react-symbols 采用 MIT 许可，
// Copyright (c) 2022 Pablo Hernández，这条版权声明列在仓库根目录的 LICENSE-CODE 中。
const codeBlockIcons = {
  json: {
    viewBox: "0 0 24 24",
    fill: "#EA580C",
    d: "M4.778 6.667A2.667 2.667 0 017.444 4a.889.889 0 010 1.778.889.889 0 00-.888.889v3.5c0 .701-.273 1.35-.73 1.833.457.483.73 1.132.73 1.832v3.501c0 .491.398.89.888.89a.889.889 0 010 1.777 2.667 2.667 0 01-2.666-2.667v-3.5a.889.889 0 00-.674-.863l-.43-.108a.889.889 0 010-1.724l.43-.108a.889.889 0 00.674-.862V6.667zm14.222 0A2.667 2.667 0 0016.333 4a.889.889 0 000 1.778c.491 0 .89.398.89.889v3.5c0 .701.272 1.35.729 1.833a2.664 2.664 0 00-.73 1.832v3.501a.889.889 0 01-.889.89.889.889 0 000 1.777A2.667 2.667 0 0019 17.333v-3.5c0-.408.278-.764.673-.863l.431-.108a.889.889 0 000-1.724l-.43-.108a.889.889 0 01-.674-.862V6.667z",
  },
  yaml: {
    viewBox: "0 0 24 24",
    fill: "#A78BFA",
    d: "M6.533 5.864h2.755l2.654 5.011h.113l2.654-5.011h2.756l-4.245 7.522V17.5h-2.443v-4.114L6.533 5.864z",
  },
  // MDX icon with M text and X stroke
  mdx: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><path stroke="#60A5FA" stroke-width="2" d="M21.726 15.446L14.83 8.552m.059 6.896l6.896-6.896"></path><path fill="#60A5FA" d="M3 15.714V8h2.323l2.322 2.836L9.968 8h2.322v7.714H9.968V11.29l-2.323 2.836-2.322-2.836v4.424H3z"></path></svg>',
};

export default defineConfig({
  plugins: [
    jsonSchema({
      insert: true,
    }),
    lastModified(),
  ],
  mdxOptions: async () => {
    const { rehypeCodeDefaultOptions } =
      await import('fumadocs-core/mdx-plugins/rehype-code');
    const { remarkSteps } =
      await import('fumadocs-core/mdx-plugins/remark-steps');
    const { transformerTwoslash } = await import('fumadocs-twoslash');
    const { createFileSystemTypesCache } =
      await import('fumadocs-twoslash/cache-fs');
    const { default: remarkMath } = await import('remark-math');
    const { remarkTypeScriptToJavaScript } =
      await import('fumadocs-docgen/remark-ts2js');
    const { default: rehypeKatex } = await import('rehype-katex');
    const { remarkAutoTypeTable } = await import('fumadocs-typescript');

    return {
      remarkStructureOptions: {
        types: [...remarkStructureDefaultTypes, 'code'],
      },
      rehypeCodeOptions: {
        langs: ['ts', 'js', 'html', 'tsx', 'mdx', 'bash', 'sh'],
        inline: 'tailing-curly-colon',
        themes: {
          light: 'catppuccin-latte',
          dark: 'catppuccin-mocha',
        },
        icon: {
          shortcuts: {
            yml: 'yaml',
          },
          extend: codeBlockIcons,
        },
        transformers: [
          ...(rehypeCodeDefaultOptions.transformers ?? []),
          transformerTwoslash({
            typesCache: createFileSystemTypesCache(),
          }),
          transformerEscape(),
          transformerDefaultWrap(),
        ],
      },
      remarkCodeTabOptions: {
        parseMdx: true,
      },
      remarkNpmOptions: {
        persist: {
          id: 'package-manager',
        },
      },
      remarkPlugins: [
        remarkSteps,
        remarkMath,
        remarkAutoTypeTable,
        remarkTypeScriptToJavaScript,
      ],
      rehypePlugins: (v) => [rehypeKatex, ...v],
    };
  },
});
