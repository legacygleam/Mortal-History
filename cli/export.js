#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { createClient } from '../lib/arweave.js';

async function exportArchive(txId, outputDir) {
  const client = createClient();
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`Exporting archive from tx: ${txId}`);
  const data = await client.transactions.getData(txId, { decode: true, string: true });
  const outputPath = path.join(outputDir, `${txId}.md`);
  fs.writeFileSync(outputPath, data);
  console.log(`Saved to: ${outputPath}`);
}

const [txId, outputDir] = process.argv.slice(2);
if (!txId || !outputDir) {
  console.error('Usage: node cli/export.js <tx-id> <output-dir>');
  process.exit(1);
}

exportArchive(txId, outputDir).catch(err => {
  console.error('Export failed:', err);
  process.exit(1);
});
