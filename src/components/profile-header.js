import { escapeHtml } from '../utils/escape.js';

export function renderProfileHeader(profile, did) {
  const p = profile || {};
  return `
    <div class="profile-header">
      <div class="profile-avatar">
        ${p.avatar ? `<img src="${escapeHtml(p.avatar)}" alt="">` : '<div class="avatar-placeholder">?</div>'}
      </div>
      <div class="profile-info">
        <h1>${escapeHtml(p.nickname || '未知')}</h1>
        ${p.name ? `<p class="profile-realname">${escapeHtml(p.name)}</p>` : ''}
        <p class="profile-meta">
          ${escapeHtml(p.birthYear || '?')} — ${escapeHtml(p.deathYear || '至今')}
          ${p.nationality ? ` · ${escapeHtml(p.nationality)}` : ''}
        </p>
        ${p.bio ? `<p class="profile-bio">${escapeHtml(p.bio)}</p>` : ''}
        <p class="profile-did">DID: ${escapeHtml(did || '')}</p>
      </div>
    </div>
  `;
}
