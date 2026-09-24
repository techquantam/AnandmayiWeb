const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    storeName: { type: String, default: 'Anandmayi Puja Bhandar' },
    storeEmail: { type: String, default: 'support@anandmayi.com' },
    storePhone: { type: String, default: '+91 1234567890' },
    address: { type: String },
    gstNumber: { type: String },
    shippingCharge: { type: Number, default: 50 },
    freeShippingThreshold: { type: Number, default: 500 },
    codAvailable: { type: Boolean, default: true },
    minimumOrderAmount: { type: Number, default: 100 },
    currency: { type: String, default: 'INR' }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
