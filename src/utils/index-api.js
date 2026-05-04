const INDEX_API = 'https://api.eternallife.app';

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
  return (result.data?.transactions?.edges || []).map(e => e.node);
}
