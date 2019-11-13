import { request } from './base';
import { BASE_URL } from './url';

export const getPosts = (data, useCache = false) => {
  return request.get(`${BASE_URL}/talk/getPosts`, data, useCache);
};

export const createPost = (data, useCache = false) => {
  return request.post(`${BASE_URL}/talk/post/create`, data, useCache);
};

export const deletePost = (data, useCache = false) => {
  return request.delete(`${BASE_URL}/talk/post/delete`, data, useCache);
};
