const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    link: { type: String },
    image: {
        public_id: { type: String },
        url: { type: String, required: true }
    },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);
