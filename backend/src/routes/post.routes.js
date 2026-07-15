const express = require('express');
const router = express.Router();
const {
    createPost,
    getFeed,
    likePost,
    updatePost,
    deletePost
} = require('../controllers/post.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all routes for posts
router.use(protect);

router.get('/', getFeed);
router.post('/', createPost);
router.post('/:id/like', likePost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
