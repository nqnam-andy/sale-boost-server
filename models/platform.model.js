const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const platformSchema = new mongoose.Schema({
    siteId: { type:  ObjectId, ref: 'User', required: true },
    url: { type: String, required: true },
    key: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Platform', platformSchema);
