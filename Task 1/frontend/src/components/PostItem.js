import React from 'react';
import { useAuth } from '../hooks/useAuth';

const PostItem = ({ post, onDelete }) => {
    const { currentUser } = useAuth();
    return (
        <div className="post-item">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <small>By: {post.user.name}</small>
            {currentUser && currentUser._id === post.user._id && (
                <div>
                    <button onClick={() => onDelete(post._id)} className="btn btn-danger">Delete</button>
                </div>
            )}
        </div>
    );
};

export default PostItem;