const GATEWAY = 'https://arweave.net';

export async function fetchFromArweave(txId) {
  const response = await fetch(`${GATEWAY}/${txId}`);
  if (!response.ok) throw new Error(`Failed to fetch ${txId}: ${response.status}`);
  return response.text();
}

export function buildGatewayUrl(txId) {
  return `${GATEWAY}/${txId}`;
}

export function buildGraphQLQuery(tags, limit = 20) {
  const tagFilters = tags.map(t => {
    const safeName = JSON.stringify(String(t.name));
    const safeValue = JSON.stringify(String(t.value));
    return `{ name: ${safeName}, values: [${safeValue}] }`;
  });
  return {
    query: `
      query {
        transactions(
          tags: [${tagFilters.join(', ')}]
          first: ${Math.min(Math.max(1, limit), 100)}
        ) {
          edges {
            node {
              id
              tags { name value }
              block { timestamp }
            }
          }
        }
      }
    `
  };
}

export async function queryArweave(tags, limit = 20) {
  const response = await fetch(`${GATEWAY}/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGraphQLQuery(tags, limit)),
  });
  const result = await response.json();
  return result.data?.transactions?.edges || [];
}
