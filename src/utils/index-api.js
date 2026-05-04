const INDEX_API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3001'
  : 'https://api.eternallife.app';

export async function fetchRecent(max = 20) {
  try {
    const response = await fetch(`${INDEX_API}/recent?limit=${max}`);
    if (!response.ok) throw new Error('Failed to fetch recent');
    return await response.json();
  } catch {
    return fallbackRecent();
  }
}

export async function searchProfiles(query) {
  try {
    const response = await fetch(`${INDEX_API}/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Search failed');
    return await response.json();
  } catch {
    return [];
  }
}

export async function fetchRandom() {
  try {
    const response = await fetch(`${INDEX_API}/random`);
    if (!response.ok) throw new Error('Failed to fetch random');
    return await response.json();
  } catch {
    return null;
  }
}

export async function fetchProfileById(txId) {
  try {
    const response = await fetch(`${INDEX_API}/profile/${encodeURIComponent(txId)}`);
    if (!response.ok) throw new Error('Profile not found in index');
    return await response.json();
  } catch {
    return null;
  }
}

async function fallbackRecent() {
  const response = await fetch('https://arweave.net/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        transactions(tags: [{ name: "App-Name", values: ["EternalLife"] }, { name: "File-Type", values: ["profile"] }], first: 20, sort: HEIGHT_DESC) {
          edges {
            node { id tags { name value } }
          }
        }
      }`
    }),
  });
  const result = await response.json();
  return (result.data?.transactions?.edges || []).map(e => {
    const tags = {};
    for (const tag of (e.node.tags || [])) {
      tags[tag.name] = tag.value;
    }
    return {
      id: e.node.id,
      title: tags['Title'] || null,
      language: tags['Language'] || 'zh',
      timestamp: e.node.block?.timestamp || null,
      ...tags,
    };
  });
}
