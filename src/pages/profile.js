import { fetchFromArweave } from '../utils/arweave-gateway.js';
import { parseFrontmatter } from '../../lib/frontmatter.js';
import { renderProfileHeader } from '../components/profile-header.js';

export async function ProfilePage(params, container) {
  const { txId } = params;
  container.innerHTML = `<div class="profile-loading"><p>加载档案中...</p></div>`;

  try {
    const content = await fetchFromArweave(txId);
    const { data, content: body } = parseFrontmatter(content);

    if (!data) {
      container.innerHTML = '<p>无法解析档案数据</p>';
      return;
    }

    container.innerHTML = `
      <article class="profile-page">
        ${renderProfileHeader(data, data.author)}
        <div class="profile-content">
          <md-viewer id="profile-body"></md-viewer>
        </div>
      </article>
    `;

    const viewer = container.querySelector('#profile-body');
    if (viewer) viewer.content = body;
  } catch (err) {
    container.innerHTML = `<div class="error"><p>加载失败: ${err.message}</p></div>`;
  }
}
