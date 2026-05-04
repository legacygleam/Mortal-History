import { describe, it, expect } from 'vitest';
import { validateArchive, validateProfile, validateLanguage } from '../../lib/validator.js';

describe('validateArchive', () => {
  it('should accept a valid archive structure', () => {
    const archive = {
      'profile.md': '---\nauthor: did:ar:abc\n---\nContent',
      'languages.json': '{"primary":"zh","available":["zh"]}',
      'biography/01-童年.md': '---\nauthor: did:ar:abc\n---\n回忆内容',
    };
    const result = validateArchive(archive);
    expect(result.valid).toBe(true);
  });

  it('should reject archive missing required files', () => {
    const archive = { 'biography/01.md': 'content' };
    const result = validateArchive(archive);
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
    expect(result.errors[0]).toContain('profile.md');
    expect(result.errors[1]).toContain('languages.json');
  });
});

describe('validateProfile', () => {
  it('should validate a correct profile', () => {
    const profile = {
      name: '张三',
      nickname: '山月',
      birthYear: 1980,
      deathYear: null,
      nationality: 'CN',
    };
    expect(validateProfile(profile).valid).toBe(true);
  });

  it('should require nickname', () => {
    expect(validateProfile({ name: '张三' }).valid).toBe(false);
  });
});

describe('validateLanguage', () => {
  it('should accept zh and en', () => {
    const result = validateLanguage({ primary: 'zh', available: ['zh', 'en'] });
    expect(result.valid).toBe(true);
  });

  it('should reject unsupported language', () => {
    const result = validateLanguage({ primary: 'xx', available: ['xx'] });
    expect(result.valid).toBe(false);
  });
});
