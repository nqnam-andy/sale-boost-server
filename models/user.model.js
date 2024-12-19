const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    siteId: { type: String, required: true, unique: true },
    amountAction: { type: String, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
