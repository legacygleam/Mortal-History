const GATEWAY = 'https://arweave.net';

export async function crawlNewProfiles(lastTxId = null) {
  const query = buildProfileQuery(lastTxId);
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query),
  });
  const result = await response.json();
  return (result.data?.transactions?.edges || []).map(e => ({
    txId: e.node.id,
    tags: parseTags(e.node.tags),
    timestamp: e.node.block?.timestamp,
  }));
}

function buildProfileQuery(cursor) {
  const after = cursor ? `, after: "${cursor}"` : '';
  return {
    query: `{
      transactions(
        tags: [
          { name: "App-Name", values: ["EternalLife"] },
          { name: "File-Type", values: ["profile"] }
        ],
        first: 50,
        sort: HEIGHT_DESC${after}
      ) {
        edges {
          cursor
          node {
            id
            tags { name value }
            block { timestamp }
          }
        }
      }
    }`
  };
}

function parseTags(tags) {
  const map = {};
  for (const tag of tags) {
    map[tag.name] = tag.value;
  }
  return map;
}

export async function fetchProfileContent(txId) {
  const response = await fetch(`${GATEWAY}/${txId}`);
  if (!response.ok) throw new Error(`Failed to fetch ${txId}`);
  return response.text();
}
