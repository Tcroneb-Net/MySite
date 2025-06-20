import mongoose from 'mongoose';

const publicBotSchema = new mongoose.Schema({
  botName: { type: String, required: true },
  botToken: { type: String, required: true },
  chatId: { type: String, required: true },
  active: { type: Boolean, default: true },
  lastSync: { type: Date, default: Date.now }
});

export default mongoose.model('PublicBot', publicBotSchema);