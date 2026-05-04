import { HomePage } from './pages/home.js';
import { ProfilePage } from './pages/profile.js';
import { WritePage } from './pages/write.js';
import { connectWallet, getWalletAddress } from './utils/wallet.js';

const routes = {
  '/': HomePage,
};

function router() {
  const path = window.location.pathname;
  const main = document.getElementById('app-main');

  const profileMatch = path.match(/^\/profile\/(.+)/);
  if (profileMatch) {
    ProfilePage({ txId: profileMatch[1] }, main);
    return;
  }

  if (path === '/random') {
    import('./pages/random.js').then(m => m.RandomPage({}, main));
    return;
  }

  if (path === '/write') {
    WritePage({}, main);
    return;
  }

  const Page = routes[path] || HomePage;
  Page({}, main);
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('[data-nav]');
  if (link) {
    e.preventDefault();
    const href = link.getAttribute('href');
    window.history.pushState({}, '', href);
    router();
  }
});

window.addEventListener('popstate', router);
router();

document.getElementById('wallet-btn')?.addEventListener('click', async () => {
  try {
    const address = await connectWallet();
    const btn = document.getElementById('wallet-btn');
    btn.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    btn.classList.add('connected');
  } catch (err) {
    if (!window.arweaveWallet) {
      alert('请安装 ArConnect 钱包: https://www.arconnect.io');
    }
  }
});

(async () => {
  const address = await getWalletAddress();
  if (address) {
    const btn = document.getElementById('wallet-btn');
    btn.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;
    btn.classList.add('connected');
  }
})();
