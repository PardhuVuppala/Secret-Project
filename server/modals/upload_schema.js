const mongoose = require('mongoose');

const CloudinaryAssetSchema = new mongoose.Schema(
    {   userid : { type :String, required: true },
        password : {type:String, required: true },
        assetId: { type: String, unique: true, required: true },
        publicId: { type: String, unique: true, required: true },
        version: { type: Number, required: true },
        versionId: { type: String, required: true },
        signature: { type: String, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        format: { type: String, required: true },
        resourceType: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        tags: { type: [String], default: [] }, 
        bytes: { type: Number, required: true },
        type: { type: String, required: true },
        etag: { type: String, required: true },
        placeholder: { type: Boolean, default: false },
        url: { type: String, required: true },
        secureUrl: { type: String, required: true },
        assetFolder: { type: String, default: '' }, 
        displayName: { type: String, required: true },
        apiKey: { type: String, required: true }
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('CloudinaryAsset', CloudinaryAssetSchema);
