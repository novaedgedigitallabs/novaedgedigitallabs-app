const express = require('express');
const router = express.Router();
const {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} = require('../controllers/blog.controller');
const { protect } = require('../middleware/auth.middleware');
const { checkAdmin } = require('../middleware/admin.middleware');

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Admin routes
router.post('/', protect, checkAdmin, createBlog);
router.put('/:id', protect, checkAdmin, updateBlog);
router.delete('/:id', protect, checkAdmin, deleteBlog);

module.exports = router;
