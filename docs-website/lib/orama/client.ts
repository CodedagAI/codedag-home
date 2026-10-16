import { OramaCloud } from '@orama/core';

export const DataSourceId = process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID ?? '';

export const isAdmin = process.env.ORAMA_PRIVATE_API_KEY !== undefined;

// Check if Orama Cloud is configured
export const isOramaCloudConfigured = Boolean(
  process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID &&
  process.env.NEXT_PUBLIC_ORAMA_API_KEY
);

// Only create OramaCloud client if configured
export const orama = isOramaCloudConfigured
  ? new OramaCloud({
      projectId: process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID as string,
      apiKey:
        process.env.ORAMA_PRIVATE_API_KEY ??
        (process.env.NEXT_PUBLIC_ORAMA_API_KEY as string),
    })
  : null;
