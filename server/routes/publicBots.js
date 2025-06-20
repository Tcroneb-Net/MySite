import express from 'express';
import axios from 'axios';
import PublicBot from '../models/PublicBot.js';

const router = express.Router();
const GIT_BOTS_RAW_URL = 'https://raw.githubusercontent.com/yourusername/yourrepo/main/bots.json';

router.post('/sync', async (req, res) => {
  try {
    const { data } = await axios.get(GIT_BOTS_RAW_URL);
    if (!Array.isArray(data)) return res.status(400).json({ message: 'Invalid format' });

    await PublicBot.deleteMany({});
    await PublicBot.insertMany(data);
    res.json({ message: `Synced ${data.length} bots` });
  } catch (err) {
    res.status(500).json({ message: 'Sync failed' });
  }
});

export default router;