import { marked } from 'marked';

export class MarkdownViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set content(value) {
    this._content = value;
    this.render();
  }

  render() {
    if (!this._content) return;
    const raw = marked.parse(this._content, { breaks: true });
    const html = sanitizeHtml(raw);
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; line-height: 1.8; }
        :host h1 { font-size: 1.8rem; margin: 1.5rem 0 0.5rem; }
        :host h2 { font-size: 1.4rem; margin: 1.25rem 0 0.5rem; }
        :host p { margin: 0.75rem 0; }
        :host img { max-width: 100%; border-radius: var(--radius-sm); }
        :host blockquote {
          border-left: 3px solid var(--color-primary);
          padding-left: 1rem;
          color: var(--color-text-secondary);
          margin: 1rem 0;
        }
      </style>
      <div class="markdown-body">${html}</div>
    `;
  }
}

function sanitizeHtml(str) {
  // Strip all HTML tags except safe ones
  const safeTags = ['h1','h2','h3','h4','h5','h6','p','br','ul','ol','li',
    'blockquote','pre','code','em','strong','del','hr','table','thead','tbody',
    'tr','th','td','img','a','div','span','section'];
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]*on\w+\s*=[^>]*>/gi, '')       // Remove any tag with event handler (no quotes needed)
    .replace(/href\s*=\s*(?:"|')?\s*javascript\s*:/gi, 'href="#"')  // Catch both quoted and unquoted
    // Strip any tags not in the safe list
    .replace(/<\/?(\w+)[^>]*>/g, (match, tag) => {
      return safeTags.includes(tag.toLowerCase()) ? match : '';
    });
}

customElements.define('md-viewer', MarkdownViewer);
