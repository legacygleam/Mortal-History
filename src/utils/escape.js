export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function escapeHtmlObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const escaped = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      escaped[key] = escapeHtml(value);
    } else {
      escaped[key] = value;
    }
  }
  return escaped;
}
