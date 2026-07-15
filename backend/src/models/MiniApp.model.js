const mongoose = require('mongoose');

const miniAppSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true, // The URL of the game/web app (e.g., https://your-game-server.com/spin-the-wheel)
    },
    thumbnail: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    displayPosition: {
        type: String,
        enum: ['home_banner', 'floating_action', 'dedicated_tab', 'modal'],
        default: 'home_banner'
    }
}, { timestamps: true });

module.exports = mongoose.model('MiniApp', miniAppSchema);
