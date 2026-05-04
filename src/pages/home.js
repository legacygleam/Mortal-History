export function HomePage(params, container) {
  container.innerHTML = `
    <section class="hero">
      <h1>每个人都被铭记</h1>
      <p class="hero-subtitle">去中心化个人历史永久保存平台</p>
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
}
