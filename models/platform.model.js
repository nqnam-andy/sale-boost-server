const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const platformSchema = new mongoose.Schema({
    siteObjectId: { type:  ObjectId, ref: 'Site', required: true },
    url: { type: String, required: true },
    key: { type: String },
    hookName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Platform', platformSchema);
