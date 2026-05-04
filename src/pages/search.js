export function SearchPage(params, container) {
  const query = new URLSearchParams(window.location.search).get('q') || '';
  container.innerHTML = `
    <section class="search-page">
      <h1>搜索: "${query}"</h1>
      <div id="search-results" class="card-grid">
        <p>搜索功能需要索引服务支持</p>
      </div>
    </section>
  `;
}
