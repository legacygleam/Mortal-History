export function renderProfileHeader(profile, did) {
  return `
    <div class="profile-header">
      <div class="profile-avatar">
        ${profile.avatar ? `<img src="${profile.avatar}" alt="">` : '<div class="avatar-placeholder">?</div>'}
      </div>
      <div class="profile-info">
        <h1>${profile.nickname || '未知'}</h1>
        ${profile.name ? `<p class="profile-realname">${profile.name}</p>` : ''}
        <p class="profile-meta">
          ${profile.birthYear || '?'} — ${profile.deathYear || '至今'}
          ${profile.nationality ? ` · ${profile.nationality}` : ''}
        </p>
        ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ''}
        <p class="profile-did">DID: ${did}</p>
      </div>
    </div>
  `;
}
