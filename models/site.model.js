const mongoose = require('mongoose');
const { data } = require('../configs/');

const siteSchema = new mongoose.Schema({
    siteId: { type: String, required: true },
    instanceId: { type: String, required: true, unique: true },
    amountAction: { type: Number, required: true, default: data.default_amount_action },
    billing: { type: String, required: false, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Site', siteSchema);
