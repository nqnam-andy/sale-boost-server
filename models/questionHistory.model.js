const mongoose = require('mongoose');

const questionHistorySchema = new mongoose.Schema({
  siteId: { type: String, ref: 'Site', required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('QuestionHistory', questionHistorySchema);
