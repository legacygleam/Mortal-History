import { fetchRecent } from '../utils/index-api.js';

export async function HomePage(params, container) {
  container.innerHTML = `
    <section class="hero">
      <h1>每个人都被铭记</h1>
      <p class="hero-subtitle">去中心化个人历史永久保存平台</p>
      <div class="search-bar">
        <input type="text" id="search-input" placeholder="搜索姓名、国籍、年代..." />
        <button id="search-btn" class="btn btn-primary">搜索</button>
      </div>
      <div class="hero-actions">
        <a href="/write" class="btn btn-primary" data-nav>开始书写</a>
        <a href="/random" class="btn btn-secondary" data-nav>遇见一个人</a>
      </div>
    </section>
    <section id="recent-section">
      <h2>最新收录</h2>
      <div id="recent-list" class="card-grid"></div>
    </section>
  `;

  document.getElementById('search-btn')?.addEventListener('click', () => {
    const query = document.getElementById('search-input').value.trim();
    if (query) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  });

  const recentList = document.getElementById('recent-list');
  recentList.innerHTML = '<p>加载中...</p>';

  try {
    const items = await fetchRecent(12);
    if (items.length === 0) {
      recentList.innerHTML = '<p class="empty-state">还没有人留下档案，来做第一个吧</p>';
      return;
    }
    recentList.innerHTML = items.map(item => `
      <a href="/profile/${item.id}" class="card" data-nav>
        <h3>${item.title || '未知档案'}</h3>
        <p class="card-meta">${item.language || 'zh'} · ${new Date(item.timestamp || Date.now()).toLocaleDateString()}</p>
      </a>
    `).join('');
  } catch {
    recentList.innerHTML = '<p class="empty-state">暂时无法加载最新收录</p>';
  }
}
