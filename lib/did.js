const DID_PREFIX = 'did:ar:';

export function createDID(address) {
  return `${DID_PREFIX}${address}`;
}

export function formatDID(address) {
  if (address.startsWith(DID_PREFIX)) return address;
  return createDID(address);
}

export function parseDID(did) {
  if (!did || !did.startsWith(DID_PREFIX)) return null;
  return did.slice(DID_PREFIX.length);
}

export function isDID(value) {
  return typeof value === 'string' && value.startsWith(DID_PREFIX);
}
