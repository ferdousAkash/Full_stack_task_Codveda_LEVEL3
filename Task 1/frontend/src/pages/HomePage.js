import React, { useState, useEffect } from 'react';
import postService from '../services/postService';
import PostItem from '../components/PostItem';

const HomePage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postService.getPosts().then(response => {
            setPosts(response.data.data);
        });
    }, []);

    return (
        <div>
            <h1>Latest Posts</h1>
            <div>
                {posts.map(post => (
                    <PostItem key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;