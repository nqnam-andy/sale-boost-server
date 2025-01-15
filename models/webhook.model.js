const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const webhookSchema = new mongoose.Schema({
    siteId: { type:  ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Webhook', webhookSchema);