const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Notification title is required']
    },
    message: {
        type: String,
        required: [true, 'Notification message is required']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // If null, it means it's a global notification broadcast to all users
    },
    isRead: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['general', 'promotional', 'account', 'system'],
        default: 'general'
    },
    actionUrl: {
        type: String, // Optional URL to open when notification is clicked
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Optional: create index for faster query by userId
notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
