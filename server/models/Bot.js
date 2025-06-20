import mongoose from 'mongoose';

const botSchema = new mongoose.Schema({
  botName: { type: String, required: true },
  botToken: { type: String, required: true },
  chatId: { type: String, required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastPing: { type: Date, default: Date.now }
});

export default mongoose.model('Bot', botSchema);