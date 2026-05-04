import { HomePage } from './pages/home.js';
import { ProfilePage } from './pages/profile.js';

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
