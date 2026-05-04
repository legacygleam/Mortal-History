import express from 'express';
import { initDB, getRecentProfiles, searchProfiles, getRandomProfile, insertProfile, insertContent } from './db.js';
import { crawlNewProfiles, fetchProfileContent } from './crawler.js';
import { autoModerate, reportContent } from './moderation.js';

const app = express();
app.use(express.json());

initDB();

app.get('/recent', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const profiles = getRecentProfiles(limit);
  res.json(profiles);
});

app.get('/search', (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });
  const results = searchProfiles(query);
  res.json(results);
});

app.get('/random', (req, res) => {
  const profile = getRandomProfile();
  if (!profile) return res.json(null);
  res.json(profile);
});

app.post('/report', (req, res) => {
  const { txId, reason } = req.body;
  if (!txId) return res.status(400).json({ error: 'txId required' });
  const result = reportContent(txId, reason, req.ip);
  res.json(result);
});

app.post('/crawl', async (req, res) => {
  try {
    const items = await crawlNewProfiles();
    let indexed = 0;
    for (const item of items) {
      const content = await fetchProfileContent(item.txId);
      const profile = {
        tx_id: item.txId,
        author_did: item.tags['author'] || 'unknown',
        nickname: item.tags['nickname'] || '未知',
        language: item.tags['Language'] || 'zh',
        created_at: item.timestamp,
      };
      insertProfile(profile);
      autoModerate(item.txId, content);
      indexed++;
    }
    res.json({ indexed, total: items.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`EternalLife indexer running on port ${PORT}`);
});
