import { searchProfiles } from '../utils/index-api.js';

export async function SearchPage(params, container) {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  container.innerHTML = `
    <section class="search-page">
      <div class="search-header">
        <h1>搜索结果: "${query}"</h1>
      </div>
      <div id="search-results" class="card-grid">
        <p>搜索中...</p>
      </div>
    </section>
  `;

  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '<p>请输入搜索关键词</p>';
    return;
  }

  try {
    const items = await searchProfiles(query);
    const resultsEl = document.getElementById('search-results');

    if (items.length === 0) {
      resultsEl.innerHTML = '<p class="empty-state">未找到匹配结果</p>';
      return;
    }

    resultsEl.innerHTML = items.map(item => `
      <a href="/profile/${item.tx_id || item.id}" class="card" data-nav>
        <h3>${item.nickname || item.title || '未知档案'}</h3>
        <p class="card-meta">
          ${item.real_name ? `${item.real_name} · ` : ''}
          ${item.nationality || ''}
          ${item.birth_year ? `${item.birth_year}—${item.death_year || '至今'}` : ''}
        </p>
        ${item.bio ? `<p class="card-desc">${item.bio}</p>` : ''}
      </a>
    `).join('');
  } catch {
    document.getElementById('search-results').innerHTML = '<p class="empty-state">搜索失败，请稍后重试</p>';
  }
}
