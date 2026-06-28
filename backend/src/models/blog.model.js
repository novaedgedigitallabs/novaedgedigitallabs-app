const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    date: { type: String },
    publishedAt: { type: String },
    author: { type: String },
    category: { type: String },
    readTime: { type: String },
    imageUrl: { type: String },
    excerpt: { type: String },
    tags: [{ type: String }],
    faqs: [{
        question: String,
        answer: String
    }],
    coverImage: {
        src: String,
        alt: String,
        caption: String
    },
    body: [{ type: mongoose.Schema.Types.Mixed }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);
