import { describe, it, expect } from 'vitest';
import { ARCHIVE_STRUCTURE, REQUIRED_FILES } from '../../lib/constants.js';

describe('ARCHIVE_STRUCTURE', () => {
  it('should define biography directory', () => {
    expect(ARCHIVE_STRUCTURE).toHaveProperty('biography');
  });

  it('should define experiences directory', () => {
    expect(ARCHIVE_STRUCTURE).toHaveProperty('experiences');
  });

  it('should define wisdom directory', () => {
    expect(ARCHIVE_STRUCTURE).toHaveProperty('wisdom');
  });

  it('should define assets directory', () => {
    expect(ARCHIVE_STRUCTURE).toHaveProperty('assets');
  });
});

describe('REQUIRED_FILES', () => {
  it('should include profile.md', () => {
    expect(REQUIRED_FILES).toContain('profile.md');
  });

  it('should include languages.json', () => {
    expect(REQUIRED_FILES).toContain('languages.json');
  });
});
