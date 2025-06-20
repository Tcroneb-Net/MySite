import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

  const exist = await User.findOne({ $or: [{ email }, { username }] });
  if (exist) return res.status(400).json({ message: 'Email or username taken' });

  const passwordHash = await bcrypt.hash(password, 12);
  const isFirst = (await User.countDocuments()) === 0;
  const role = isFirst ? 'owner' : 'user';

  const user = new User({ username, email, passwordHash, role });
  await user.save();
  res.status(201).json({ message: 'Registered' });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15d' });
  user.token = token;
  user.tokenCreatedAt = new Date();
  await user.save();
  res.json({ token, username: user.username, role: user.role });
});

export default router;