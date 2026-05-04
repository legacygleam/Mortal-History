#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient, getAddress } from '../lib/arweave.js';
import { ArchiveUploader } from '../lib/upload.js';
import { createFrontmatter } from '../lib/frontmatter.js';

async function publishArchive(archiveDir, walletPath) {
  const wallet = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const client = createClient();
  const address = await getAddress(client, wallet);
  const uploader = new ArchiveUploader(wallet, client);

  console.log(`Publishing archive for address: ${address}`);

  function walkDir(dir, relativeDir = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walkDir(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (!content.startsWith('---')) {
          const fm = createFrontmatter({ author: `did:ar:${address}` });
          content = fm + content;
        }
        console.log(`Uploading: ${relPath}`);
        uploader.uploadMarkdown(content, relPath);
      }
    }
  }

  walkDir(archiveDir);
  console.log('Upload complete:', uploader.getUploadedIds());
}

const [archiveDir, walletPath] = process.argv.slice(2);
if (!archiveDir || !walletPath) {
  console.error('Usage: node cli/publish.js <archive-dir> <wallet-file>');
  process.exit(1);
}

publishArchive(archiveDir, walletPath).catch(err => {
  console.error('Publish failed:', err);
  process.exit(1);
});
