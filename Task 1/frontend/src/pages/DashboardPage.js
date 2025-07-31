import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import postService from '../services/postService';
import PostItem from '../components/PostItem';

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetchPosts = () => {
        postService.getPosts().then(response => {
            setPosts(response.data.data);
        });
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            await postService.createPost({ title, content });
            setTitle('');
            setContent('');
            fetchPosts(); // Refresh posts list
        } catch (error) {
            console.error('Failed to create post', error);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await postService.deletePost(id);
            fetchPosts(); // Refresh posts list
        } catch (error) {
            console.error('Failed to delete post', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {currentUser.name}!</p>

            <div className="form-container">
                <h2>Create a New Post</h2>
                <form onSubmit={handleCreatePost}>
                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Content</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Post</button>
                </form>
            </div>

            <h2>Your Posts</h2>
            <div>
                {posts.filter(p => p.user._id === currentUser._id).map(post => (
                    <PostItem key={post._id} post={post} onDelete={handleDeletePost} />
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;
