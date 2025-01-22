const mongoose = require('mongoose');

const siteSchema = new mongoose.Schema({
    siteId: { type: String, required: true },
    instanceId: { type: String, required: true, unique: true },
    amountAction: { type: Number, required: true, default: 20 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
