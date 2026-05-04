export async function connectWallet() {
  if (!window.arweaveWallet) {
    window.open('https://www.arconnect.io', '_blank');
    throw new Error('请先安装 ArConnect 钱包插件');
  }

  await window.arweaveWallet.connect([
    'ACCESS_ADDRESS',
    'ACCESS_PUBLIC_KEY',
    'SIGN_TRANSACTION',
    'DISPATCH',
  ]);

  const address = await window.arweaveWallet.getActiveAddress();
  return address;
}

export async function getWalletAddress() {
  if (!window.arweaveWallet) return null;
  try {
    return await window.arweaveWallet.getActiveAddress();
  } catch {
    return null;
  }
}
