import { REQUIRED_FILES, ALLOWED_LANGUAGES } from './constants.js';

export function validateArchive(files) {
  const errors = [];
  for (const required of REQUIRED_FILES) {
    if (!(required in files)) {
      errors.push(`Missing required file: ${required}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateProfile(profile) {
  const errors = [];
  if (!profile.nickname) errors.push('nickname is required');
  if (profile.birthYear && (typeof profile.birthYear !== 'number' || profile.birthYear < 1800)) {
    errors.push('birthYear must be a valid year >= 1800');
  }
  return { valid: errors.length === 0, errors };
}

export function validateLanguage(config) {
  const errors = [];
  if (!config.primary) errors.push('primary language is required');
  if (!ALLOWED_LANGUAGES.includes(config.primary)) {
    errors.push(`Unsupported language: ${config.primary}`);
  }
  if (config.available) {
    for (const lang of config.available) {
      if (!ALLOWED_LANGUAGES.includes(lang)) {
        errors.push(`Unsupported language: ${lang}`);
      }
    }
  }
  return { valid: errors.length === 0, errors };
}
