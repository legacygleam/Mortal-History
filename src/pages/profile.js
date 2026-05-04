import { fetchFromArweave } from '../utils/arweave-gateway.js';
import { fetchProfileById } from '../utils/index-api.js';
import { parseFrontmatter } from '../../lib/frontmatter.js';
import { renderProfileHeader } from '../components/profile-header.js';

export async function ProfilePage(params, container) {
  const { txId } = params;
  if (!txId) {
    container.innerHTML = '<div class="error"><p>缺少档案 ID</p></div>';
    return;
  }

  container.innerHTML = `<div class="profile-loading"><p>加载档案中...</p></div>`;

  // Try Arweave first (real on-chain content)
  try {
    const content = await fetchFromArweave(txId);
    const { data, content: body } = parseFrontmatter(content);

    if (data) {
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
      return;
    }
  } catch {
    // Arweave fetch failed, fall through to indexer fallback
  }

  // Fallback: try indexer metadata
  try {
    const result = await fetchProfileById(txId);
    if (!result || !result.profile) {
      container.innerHTML = '<div class="error"><p>无法解析档案数据</p></div>';
      return;
    }

    const p = result.profile;
    container.innerHTML = `
      <article class="profile-page">
        ${renderProfileHeader({
          nickname: p.nickname,
          name: p.real_name,
          birthYear: p.birth_year,
          deathYear: p.death_year,
          nationality: p.nationality,
          bio: p.bio,
        }, p.author_did)}
        <div class="profile-content">
          <p class="empty-state">此档案的完整内容尚未上链或索引服务暂未获取到内容</p>
          ${result.contents && result.contents.length > 0 ? `
            <div class="profile-chapters">
              <h2>章节</h2>
              ${result.contents.map(c => `
                <div class="chapter-item">
                  <h3>${c.title || '未命名章节'}</h3>
                  ${c.summary ? `<p>${c.summary}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </article>
    `;
  } catch {
    container.innerHTML = '<div class="error"><p>无法解析档案数据</p></div>';
  }
}
