const Blog = require('../models/blog.model');

exports.getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blogs',
            error: error.message
        });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching blog',
            error: error.message
        });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const blog = await Blog.create(req.body);
        res.status(201).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating blog',
            error: error.message
        });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating blog',
            error: error.message
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
        }
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while deleting blog',
            error: error.message
        });
    }
};
