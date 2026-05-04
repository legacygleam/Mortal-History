import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createClient, uploadFile, downloadFile, signData } from '../../lib/arweave.js';

vi.mock('arweave', () => {
  return {
    default: {
      init: vi.fn(() => ({
        transactions: {
          getData: vi.fn().mockResolvedValue(Buffer.from('test data')),
          sign: vi.fn().mockResolvedValue(),
          post: vi.fn().mockResolvedValue({ status: 200 }),
        },
        createTransaction: vi.fn().mockResolvedValue({
          id: 'mock-tx-id',
          addTag: vi.fn(),
        }),
        crypto: {
          sign: vi.fn().mockResolvedValue('mock-signature'),
        },
        wallets: {
          jwkToAddress: vi.fn().mockResolvedValue('mock-address'),
        },
      })),
    },
  };
});

describe('createClient', () => {
  it('should create a client with default gateway', () => {
    const client = createClient();
    expect(client).toBeDefined();
  });
});

describe('uploadFile', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('should upload data and return txId', async () => {
    const client = createClient();
    const mockWallet = {};
    const result = await uploadFile(client, mockWallet, Buffer.from('hello'), 'text/plain');
    expect(result).toHaveProperty('txId');
    expect(result.txId).toBe('mock-tx-id');
  });
});

describe('downloadFile', () => {
  it('should download data by txId', async () => {
    const client = createClient();
    const data = await downloadFile(client, 'mock-tx-id');
    expect(data).toBeDefined();
  });
});
