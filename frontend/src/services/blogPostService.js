// src/services/blogPostService.js
import apiClient from './apiClient';

const blogPostService = {
  // Get all published posts (Public)
  getAllPublishedPosts: (page = 0, size = 10) => {
    return apiClient
      .get('/blog-posts', { params: { page, size } })
      .then(res => res.data); // Backend returns Page<BlogPostResponse>
  },

  // Get post by ID (Public)
  getPostById: id => {
    return apiClient.get(`/blog-posts/${id}`).then(res => res.data);
  },
  // Get my posts (Authenticated)
  getMyPosts: (page = 0, size = 10) => {
    return apiClient
      .get('/blog-posts/my-posts', { params: { page, size } })
      .then(res => res.data); // Backend returns Page<BlogPostResponse>
  },

  // Create post (Authenticated)
  createPost: postData => {
    return apiClient.post('/blog-posts', postData).then(res => res.data);
  },

  // Update post (Authenticated)
  updatePost: (id, postData) => {
    return apiClient.put(`/blog-posts/${id}`, postData).then(res => res.data);
  },

  // Delete post (Authenticated)
  deletePost: id => {
    return apiClient.delete(`/blog-posts/${id}`);
  },
  // Get pending posts (Staff/Admin)
  getPendingPosts: (page = 0, size = 10) => {
    return apiClient
      .get('/blog-posts/pending', { params: { page, size } })
      .then(res => res.data); // Backend returns Page<BlogPostResponse>
  },

  // Get draft posts (Staff/Admin)
  getDraftPosts: (page = 0, size = 10) => {
    return apiClient
      .get('/blog-posts/drafts', { params: { page, size } })
      .then(res => res.data); // Backend returns Page<BlogPostResponse>
  },

  // Approve post (Staff/Admin)
  approvePost: id => {
    return apiClient.put(`/blog-posts/${id}/approve`).then(res => res.data);
  },
};

export default blogPostService;
