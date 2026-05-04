import { fetchRandom } from '../utils/index-api.js';
import { escapeHtml } from '../utils/escape.js';

export async function RandomPage(params, container) {
  container.innerHTML = `
    <section class="random-section">
      <h1>遇见一个人</h1>
      <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
      <div class="random-loading">
        <p>正在随机寻找...</p>
      </div>
    </section>
  `;

  try {
    const profile = await fetchRandom();
    if (!profile) {
      container.innerHTML = `
        <section class="random-section">
          <h1>遇见一个人</h1>
          <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
          <div class="random-empty">
            <p>还没有人留下档案，来做第一个吧</p>
            <a href="/write" class="btn btn-primary" data-nav>开始书写</a>
          </div>
        </section>
      `;
      return;
    }

    const txId = encodeURIComponent(profile.tx_id || profile.id);
    const nickname = escapeHtml(profile.nickname || '?');
    const initial = (profile.nickname || '?')[0];
    const realName = escapeHtml(profile.real_name);
    const bio = escapeHtml(profile.bio);
    const birthYear = profile.birth_year || '?';
    const deathYear = profile.death_year || '至今';
    const nationality = escapeHtml(profile.nationality || '');

    container.innerHTML = `
      <section class="random-section">
        <h1>遇见一个人</h1>
        <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
        <div class="random-result">
          <a href="/profile/${txId}" class="card card-large" data-nav>
            <div class="card-avatar">${escapeHtml(initial)}</div>
            <h2>${nickname}</h2>
            ${realName ? `<p class="card-realname">${realName}</p>` : ''}
            <p class="card-meta">
              ${escapeHtml(birthYear)} — ${escapeHtml(deathYear)}
              ${nationality ? ` · ${nationality}` : ''}
            </p>
            ${bio ? `<p class="card-desc">${bio}</p>` : ''}
            <span class="btn btn-primary">阅读TA的故事</span>
          </a>
          <button id="random-again" class="btn btn-secondary">换一个人</button>
        </div>
      </section>
    `;

    document.getElementById('random-again')?.addEventListener('click', () => {
      window.location.reload();
    });
  } catch {
    container.innerHTML = `
      <section class="random-section">
        <h1>遇见一个人</h1>
        <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
        <p class="empty-state">暂时无法加载，请稍后重试</p>
        <button id="random-retry" class="btn btn-primary">重试</button>
      </section>
    `;
    document.getElementById('random-retry')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
}
