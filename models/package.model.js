const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  amountQuestion: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: false }
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
