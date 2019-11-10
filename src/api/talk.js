import { request } from './base'
import { BASE_URL } from './url'

export const getPosts = data => {
 return request.get(`${BASE_URL}/talk/getPosts`)
}

export const createPost = data => {
 return request.post(`${BASE_URL}/talk/post/create`, data)
}

export const deletePost = data => {
 return request.delete(`${BASE_URL}/talk/post/delete`, data)
}
