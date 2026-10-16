import { createOpenAPI } from 'fumadocs-openapi/server';

export const openapi = createOpenAPI({
  // OpenAPI specification file(s)
  // Add your OpenAPI yaml/json files here when ready
  input: ['./openapi.yaml'],
});
