const express = require('express');
const router = express.Router();
const { getPosts, createPost, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Chain routes for the base endpoint '/'
router.route('/')
    // @route   GET /api/posts
    // @desc    Get all posts
    // @access  Public
    .get(getPosts)

    // @route   POST /api/posts
    // @desc    Create a new post
    // @access  Private
    .post(protect, createPost);

// Chain routes for the endpoint with an ID '/:id'
router.route('/:id')
    // @route   DELETE /api/posts/:id
    // @desc    Delete a post
    // @access  Private
    .delete(protect, deletePost);

module.exports = router;