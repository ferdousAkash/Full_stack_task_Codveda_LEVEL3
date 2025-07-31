import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import postService from '../services/postService';
import PostItem from '../components/PostItem';

const DashboardPage = () => {
    const { currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const fetchUserPosts = () => {
        postService.getPosts().then(response => {
            const userPosts = response.data.data.filter(p => p.user._id === currentUser.user._id);
            setPosts(userPosts);
        }).catch(err => console.error("Could not fetch posts", err));
    };

    useEffect(() => {
        fetchUserPosts();
    }, [currentUser]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await postService.createPost({ title, content });
            setTitle('');
            setContent('');
            // The real-time listener on the homepage will handle the update there.
            // We can manually update the dashboard list for an instant feel.
            fetchUserPosts();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create post');
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await postService.deletePost(id);
            // The real-time listener on the homepage will handle the update there.
            // We manually update the dashboard list.
            setPosts(posts.filter(p => p._id !== id));
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, <strong>{currentUser.user.name}</strong>!</p>

            <div className="form-container">
                <h2>Create a New Post</h2>
                {error && <p className="error-message">{error}</p>}
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
            <div className="post-list">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <PostItem key={post._id} post={post} onDelete={handleDeletePost} />
                    ))
                ) : (
                    <p>You haven't created any posts yet.</p>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;