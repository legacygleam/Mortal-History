import yaml from 'js-yaml';

export function createFrontmatter({ author, signed, language = 'zh', ...extra }) {
  const data = {
    author,
    language,
    timestamp: new Date().toISOString(),
    ...extra,
  };
  if (signed) data.signed = signed;
  return `---\n${yaml.dump(data, { lineWidth: -1 }).trim()}\n---\n\n`;
}

export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n\n?/);
  if (!match) return { data: null, content };
  try {
    const data = yaml.load(match[1]);
    return { data, content: content.slice(match[0].length) };
  } catch {
    return { data: null, content };
  }
}
