import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import botRoutes from './routes/bot.js';
import publicBotRoutes from './routes/publicBots.js';
import User from './models/User.js';
import cron from 'node-cron';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/public-bots', publicBotRoutes);

app.get('/', (req, res) => res.send('BotPanel API OK'));

// Token cleanup
cron.schedule('0 0 * * *', async () => {
  const cutoff = new Date(Date.now() - 15 * 86400000);
  const result = await User.updateMany(
    { tokenCreatedAt: { $lt: cutoff } },
    { $unset: { token: '', tokenCreatedAt: '' } }
  );
  console.log('🧹 Tokens cleaned:', result.modifiedCount);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
