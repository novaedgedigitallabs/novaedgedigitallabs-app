const Post = require('../models/Post.model');
const User = require('../models/User.model');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res, next) => {
    try {
        let { content, link } = req.body;

        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        // Clean content: strip all hashtags (# symbol)
        content = content.replace(/#/g, '');

        if (content.length > 280) {
            return res.status(400).json({ success: false, message: 'Content cannot exceed 280 characters' });
        }

        const post = await Post.create({
            userId: req.user.id,
            content,
            link: link || null
        });

        // Populate user details for returning
        const populatedPost = await post.populate('userId', 'name email');

        res.status(201).json({
            success: true,
            data: populatedPost
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all feed posts
// @route   GET /api/posts
// @access  Private
exports.getFeed = async (req, res, next) => {
    try {
        const posts = await Post.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Like or Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const userId = req.user.id;
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            // Already liked, so unlike
            post.likes.splice(likeIndex, 1);
        } else {
            // Not liked, so like
            post.likes.push(userId);
        }

        await post.save();
        const populatedPost = await post.populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: populatedPost
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
exports.updatePost = async (req, res, next) => {
    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user is post owner
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this post' });
        }

        let { content, link } = req.body;
        if (!content) {
            return res.status(400).json({ success: false, message: 'Content is required' });
        }

        // Clean content: strip all hashtags
        content = content.replace(/#/g, '');

        if (content.length > 280) {
            return res.status(400).json({ success: false, message: 'Content cannot exceed 280 characters' });
        }

        post.content = content;
        post.link = link || null;

        await post.save();
        const populatedPost = await post.populate('userId', 'name email');

        res.status(200).json({
            success: true,
            data: populatedPost
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
exports.deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        // Make sure user is post owner
        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
