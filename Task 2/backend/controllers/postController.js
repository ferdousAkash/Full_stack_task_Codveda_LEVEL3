const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const post = await Post.create(req.body);
        const populatedPost = await post.populate('user', 'name');
        req.io.emit('postCreated', populatedPost);
        res.status(201).json({ success: true, data: populatedPost });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
        if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }
        await post.remove();
        req.io.emit('postDeleted', req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};