export function RandomPage(params, container) {
  container.innerHTML = `
    <section class="random-section">
      <h1>遇见一个人</h1>
      <p class="hero-subtitle">随机探索一段被永久保存的人生</p>
      <div class="random-loading">
        <p>正在随机寻找...</p>
      </div>
    </section>
  `;
}
