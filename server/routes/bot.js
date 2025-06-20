import express from 'express';
import jwt from 'jsonwebtoken';
import Bot from '../models/Bot.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

router.post('/add', auth, async (req, res) => {
  if (req.user.role !== 'owner') return res.status(403).json({ message: 'Only owner can add bots' });
  const { botName, botToken, chatId } = req.body;
  if (!botName || !botToken || !chatId) return res.status(400).json({ message: 'All fields required' });

  const bot = new Bot({ botName, botToken, chatId, ownerId: req.user.userId });
  await bot.save();
  res.json({ message: 'Bot added' });
});

export default router;