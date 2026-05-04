import Arweave from 'arweave';

export function createClient({ protocol = 'https', host = 'arweave.net', port = 443 } = {}) {
  return Arweave.init({ protocol, host, port });
}

export async function uploadFile(client, wallet, dataBuffer, contentType = 'application/octet-stream') {
  const tx = await client.createTransaction({ data: dataBuffer }, wallet);
  tx.addTag('Content-Type', contentType);
  tx.addTag('App-Name', 'EternalLife');
  tx.addTag('App-Version', '0.1.0');
  await client.transactions.sign(tx, wallet);
  const response = await client.transactions.post(tx);
  if (response.status !== 200 && response.status !== 202) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
  return { txId: tx.id };
}

export async function downloadFile(client, txId) {
  const data = await client.transactions.getData(txId, { decode: true, string: false });
  return data;
}

export async function signData(client, wallet, data) {
  const signature = await client.crypto.sign(wallet, data);
  return signature;
}

export async function getAddress(client, wallet) {
  return client.wallets.jwkToAddress(wallet);
}
