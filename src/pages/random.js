import { fetchRandom } from '../utils/index-api.js';

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

    const txId = profile.tx_id || profile.id;
    container.innerHTML = `
      <section class="random-section">
        <h1>遇见一个人</h1>
        <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
        <div class="random-result">
          <a href="/profile/${txId}" class="card card-large" data-nav>
            <div class="card-avatar">${(profile.nickname || '?')[0]}</div>
            <h2>${profile.nickname || '未知'}</h2>
            ${profile.real_name ? `<p class="card-realname">${profile.real_name}</p>` : ''}
            <p class="card-meta">
              ${profile.birth_year || '?'} — ${profile.death_year || '至今'}
              ${profile.nationality ? ` · ${profile.nationality}` : ''}
            </p>
            ${profile.bio ? `<p class="card-desc">${profile.bio}</p>` : ''}
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
