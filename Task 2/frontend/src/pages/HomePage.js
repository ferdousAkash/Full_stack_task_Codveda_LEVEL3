import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import PostItem from '../components/PostItem';
import io from 'socket.io-client';

const socket = io(process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postService.getPosts().then(res => setPosts(res.data.data));

        socket.on('postCreated', newPost => {
            setPosts(prevPosts => [newPost, ...prevPosts]);
        });

        socket.on('postDeleted', deletedPostId => {
            setPosts(prevPosts => prevPosts.filter(post => post._id !== deletedPostId));
        });

        return () => {
            socket.off('postCreated');
            socket.off('postDeleted');
        };
    }, []);

    return (
        <div>
            <h1>Latest Posts</h1>
            <p>New posts and deletions will appear here in real-time.</p>
            <div className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => <PostItem key={post._id} post={post} />)
                ) : (
                    <p>No posts yet. Be the first to create one!</p>
                )}
            </div>
        </div>
    );
};

export default HomePage;
