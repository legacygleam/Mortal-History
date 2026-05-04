import { getDB } from './db.js';

const BLOCKED_PATTERNS = [
  /暴力/i,
  /色情/i,
  /违法/i,
  /毒品/i,
  /恐怖/i,
];

const REPORT_THRESHOLD = 3;

export function autoModerate(txId, content) {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(content)) {
      const db = getDB();
      db.prepare(`UPDATE profiles SET moderated = 1, moderated_at = datetime('now') WHERE tx_id = ?`).run(txId);
      db.prepare(`INSERT INTO moderation_log (tx_id, action, reason, moderator) VALUES (?, 'auto_block', ?, 'system')`).run(txId, `Matched pattern: ${pattern}`);
      return false;
    }
  }
  return true;
}

export function reportContent(txId, reason, reporter) {
  const db = getDB();
  db.prepare(`INSERT INTO moderation_log (tx_id, action, reason, moderator) VALUES (?, 'report', ?, ?)`)
    .run(txId, reason, reporter);

  const count = db.prepare(`SELECT COUNT(*) as cnt FROM moderation_log WHERE tx_id = ? AND action = 'report'`)
    .get(txId);

  if (count.cnt >= REPORT_THRESHOLD) {
    db.prepare(`UPDATE profiles SET moderated = 1, moderated_at = datetime('now') WHERE tx_id = ?`).run(txId);
    db.prepare(`INSERT INTO moderation_log (tx_id, action, reason, moderator) VALUES (?, 'auto_block', 'threshold_reached', 'system')`).run(txId);
    return { action: 'blocked' };
  }

  return { action: 'reported', reports: count.cnt };
}
