import React from 'react';
import { useAuth } from '../hooks/useAuth';

const PostItem = ({ post, onDelete }) => {
    const { currentUser } = useAuth();
    const canDelete = currentUser && (currentUser.user._id === post.user._id || currentUser.user.role === 'admin');

    return (
        <div className="post-item">
            <h3>{post.title}</h3>
            <p className="meta">
                By {post.user.name} on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p>{post.content}</p>
            {canDelete && onDelete && (
                 <div className="actions">
                    <button onClick={() => onDelete(post._id)} className="btn btn-danger">Delete</button>
                </div>
            )}
        </div>
    );
};

export default PostItem;
