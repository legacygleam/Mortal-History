import { createClient } from './arweave.js';

export class ArchiveUploader {
  constructor(wallet, client) {
    this.wallet = wallet;
    this.client = client || createClient();
    this.uploadedIds = {};
  }

  async uploadProfile(content, language = 'zh') {
    return this._uploadBuffer(
      Buffer.from(content, 'utf-8'),
      'text/markdown',
      { 'File-Type': 'profile', Language: language }
    );
  }

  async uploadMarkdown(content, path, language = 'zh') {
    return this._uploadBuffer(
      Buffer.from(content, 'utf-8'),
      'text/markdown',
      { 'File-Path': path, Language: language }
    );
  }

  async uploadImage(imageBuffer, filename) {
    return this._uploadBuffer(
      imageBuffer,
      'image/webp',
      { 'File-Type': 'image', 'File-Name': filename }
    );
  }

  async _uploadBuffer(buffer, contentType, extraTags = {}) {
    const tx = await this.client.createTransaction({ data: buffer }, this.wallet);
    tx.addTag('Content-Type', contentType);
    tx.addTag('App-Name', 'EternalLife');
    tx.addTag('App-Version', '0.1.0');
    for (const [key, value] of Object.entries(extraTags)) {
      tx.addTag(key, value);
    }
    await this.client.transactions.sign(tx, this.wallet);
    const response = await this.client.transactions.post(tx);
    if (response.status !== 200 && response.status !== 202) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    this.uploadedIds[extraTags['File-Path'] || tx.id] = tx.id;
    return tx.id;
  }

  getUploadedIds() {
    return { ...this.uploadedIds };
  }
}
