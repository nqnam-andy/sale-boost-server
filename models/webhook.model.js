const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const webhookSchema = new mongoose.Schema({
    siteObjectId: { type:  ObjectId, ref: 'Site', required: true },
    type: { type: String, required: true },
    objectId: { type: String, required: true }, // id of the object that triggered the webhook
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Webhook', webhookSchema);
