import { describe, it, expect } from 'vitest';
import { createFrontmatter, parseFrontmatter } from '../../lib/frontmatter.js';

describe('createFrontmatter', () => {
  it('should create valid YAML frontmatter', () => {
    const result = createFrontmatter({
      author: 'did:ar:abc123',
      language: 'zh',
    });
    expect(result).toContain('---');
    expect(result).toContain('author: did:ar:abc123');
    expect(result).toContain('language: zh');
    expect(result).toContain('timestamp:');
  });

  it('should include default language if not provided', () => {
    const result = createFrontmatter({ author: 'did:ar:abc123' });
    expect(result).toContain('language: zh');
  });
});

describe('parseFrontmatter', () => {
  it('should parse frontmatter from markdown content', () => {
    const md = `---
author: did:ar:abc123
language: en
---

# Hello World
This is content.`;
    const result = parseFrontmatter(md);
    expect(result.data.author).toBe('did:ar:abc123');
    expect(result.data.language).toBe('en');
    expect(result.content).toContain('# Hello World');
  });

  it('should return null data if no frontmatter', () => {
    const md = '# No frontmatter';
    const result = parseFrontmatter(md);
    expect(result.data).toBeNull();
    expect(result.content).toBe(md);
  });
});
