const User = require('../models/User');
const Post = require('../models/Post');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const { GraphQLDateTime } = require('graphql-scalars'); // <-- FIX: Import Date resolver

const resolvers = {
    Date: GraphQLDateTime, // <-- FIX: Add resolver for the Date scalar

    Query: {
        posts: async () => await Post.find().sort({ createdAt: -1 }),
        post: async (_, { id }) => await Post.findById(id),
        me: async (_, __, context) => {
            if (!context.user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
            return await User.findById(context.user.id);
        }
    },

    Mutation: {
        register: async (_, { name, email, password }) => {
            const user = await User.create({ name, email, password });
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            return { token, user };
        },

        login: async (_, { email, password }) => {
            // <-- FIX: Explicitly select the password field for comparison
            const user = await User.findOne({ email }).select('+password');

            // <-- IMPROVEMENT: Check for user and password validity together
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new GraphQLError('Invalid credentials', { extensions: { code: 'BAD_USER_INPUT' } });
            }

            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            return { token, user };
        },

        createPost: async (_, { title, content }, context) => {
            if (!context.user) throw new GraphQLError('You must be logged in to create a post', { extensions: { code: 'UNAUTHENTICATED' } });
            const post = new Post({ title, content, user: context.user.id });
            await post.save();
            return post;
        },

        deletePost: async (_, { id }, context) => {
            if (!context.user) throw new GraphQLError('You must be logged in', { extensions: { code: 'UNAUTHENTICATED' } });
            const post = await Post.findById(id);
            if (!post) throw new GraphQLError('Post not found');
            if (post.user.toString() !== context.user.id && context.user.role !== 'admin') {
                throw new GraphQLError('Not authorized', { extensions: { code: 'FORBIDDEN' } });
            }
            await post.remove();
            return post;
        }
    },

    Post: {
        user: async (parent) => await User.findById(parent.user)
    },
    User: {
        posts: async (parent) => await Post.find({ user: parent.id })
    }
};

module.exports = resolvers;
