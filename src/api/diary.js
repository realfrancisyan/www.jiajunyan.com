import { request } from './base';
import { BASE_URL } from './url';

export const getPosts = (data, useCache = false) => {
  return request.get(`${BASE_URL}/diary/public/getPosts`, data, useCache);
};

export const createPost = (data, useCache = false) => {
  return request.post(`${BASE_URL}/diary/post/create`, data, useCache);
};

export const deletePost = (data, useCache = false) => {
  return request.delete(`${BASE_URL}/diary/post/delete`, data, useCache);
};

export const likePost = (data, useCache = false) => {
  return request.post(`${BASE_URL}/diary/post/like`, data, useCache);
};

export const createComment = (data, useCache = false) => {
  return request.post(`${BASE_URL}/diary/comment/create`, data, useCache);
};

export const deleteComment = (data, useCache = false) => {
  return request.delete(`${BASE_URL}/diary/comment/delete`, data, useCache);
};
