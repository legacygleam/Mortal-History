import { searchProfiles } from '../utils/index-api.js';
import { escapeHtml } from '../utils/escape.js';

export async function SearchPage(params, container) {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  const safeQuery = escapeHtml(query);
  container.innerHTML = `
    <section class="search-page">
      <div class="search-header">
        <h1>搜索结果: "${safeQuery}"</h1>
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

    resultsEl.innerHTML = items.map(item => {
      const txId = encodeURIComponent(item.tx_id || item.id);
      const nickname = escapeHtml(item.nickname || item.title || '未知档案');
      const realName = escapeHtml(item.real_name);
      const nationality = escapeHtml(item.nationality || '');
      const bio = escapeHtml(item.bio);
      const birthYear = item.birth_year || '';
      const deathYear = item.death_year || '';
      return `
        <a href="/profile/${txId}" class="card" data-nav>
          <h3>${nickname}</h3>
          <p class="card-meta">
            ${realName ? `${realName} · ` : ''}
            ${nationality}
            ${birthYear ? `${birthYear}—${deathYear || '至今'}` : ''}
          </p>
          ${bio ? `<p class="card-desc">${bio}</p>` : ''}
        </a>
      `;
    }).join('');
  } catch {
    document.getElementById('search-results').innerHTML = '<p class="empty-state">搜索失败，请稍后重试</p>';
  }
}
