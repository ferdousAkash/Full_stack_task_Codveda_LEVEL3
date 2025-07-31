import axios from 'axios';
import authHeader from './authHeader';
const API_URL = '/api/posts/';

const getPosts = () => {
    return axios.get(API_URL);
};

const createPost = (data) => {
    return axios.post(API_URL, data, { headers: authHeader() });
};

const deletePost = (id) => {
    return axios.delete(API_URL + id, { headers: authHeader() });
};

const postService = { getPosts, createPost, deletePost };
export default postService;
