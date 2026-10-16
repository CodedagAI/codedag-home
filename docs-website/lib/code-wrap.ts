// Languages that hold prose rather than code: their code blocks wrap long lines by default.
const wrapLangs = new Set(['text', 'txt', 'plaintext', 'plain', 'md', 'markdown']);

export function wrapsByDefault(lang: string | undefined): boolean {
  return lang !== undefined && wrapLangs.has(lang);
}
