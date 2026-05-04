import { describe, it, expect } from 'vitest';
import { createDID, formatDID, parseDID } from '../../lib/did.js';

describe('createDID', () => {
  it('should create a DID from a wallet address', () => {
    const did = createDID('abc123def456');
    expect(did).toBe('did:ar:abc123def456');
  });
});

describe('parseDID', () => {
  it('should extract address from DID', () => {
    const address = parseDID('did:ar:abc123def456');
    expect(address).toBe('abc123def456');
  });

  it('should return null for invalid DID', () => {
    expect(parseDID('invalid')).toBeNull();
  });
});
