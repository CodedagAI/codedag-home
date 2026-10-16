import createBundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const withAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const config: NextConfig = {
  reactStrictMode: true,
  // Keep `next dev` from appending its agent-rules block to AGENTS.md, which already
  // points to the version-matched docs in node_modules/next/dist/docs/
  agentRules: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  serverExternalPackages: [
    'ts-morph',
    'typescript',
    'oxc-transform',
    'twoslash',
    'shiki',
    '@takumi-rs/image-response',
  ],
  // lib/openapi.ts hands './openapi.yaml' to fumadocs-openapi, which reads it at request
  // time; file tracing can't see that path, so on Vercel the file is missing from the
  // functions and every page that loads the docs source fails with a 500
  outputFileTracingIncludes: {
    '/*': ['./openapi.yaml'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
    ],
  },
  async rewrites() {
    return [
      // English (no prefix) -> LLM text format
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
      {
        source: '/docs/:path*.md',
        destination: '/llms.mdx/:path*',
      },
      // Non-default languages (with prefix)
      {
        source: '/:lang(zh|ja)/docs/:path*.mdx',
        destination: '/llms.mdx/:lang/:path*',
      },
      {
        source: '/:lang(zh|ja)/docs/:path*.md',
        destination: '/llms.mdx/:lang/:path*',
      },
    ];
  },
};

const withMDX = createMDX();

export default withAnalyzer(withMDX(config));
