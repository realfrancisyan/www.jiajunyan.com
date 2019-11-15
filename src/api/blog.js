import { request } from './base';
import { BASE_URL } from './url';

export const getPosts = (data, useCache = false) => {
  return request.get(`${BASE_URL}/blog/public/getPosts`, data, useCache);
};

export const createPost = (data, useCache = false) => {
  return request.post(`${BASE_URL}/blog/post/create`, data, useCache);
};

export const deletePost = (data, useCache = false) => {
  return request.delete(`${BASE_URL}/blog/post/delete`, data, useCache);
};

export const getTags = (data, useCache = false) => {
  return request.get(`${BASE_URL}/blog/public/getTags`, data, useCache);
};

export const getSinglePost = (data, useCache = false) => {
  return request.get(`${BASE_URL}/blog/public/getSinglePost`, data, useCache);
};
