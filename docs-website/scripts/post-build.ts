import env from '@next/env';
import { updateSearchIndexes } from './update-orama-index';

env.loadEnvConfig(process.cwd());

async function main() {
  await Promise.all([updateSearchIndexes()]);
}

// 后处理失败必须让 `pnpm build` 失败，从而阻断发布
await main().catch((e) => {
  console.error('Failed to run post build script', e);
  process.exit(1);
});
