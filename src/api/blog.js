import { request } from './base'
import { BASE_URL } from './url'

export const listTags = data => {
 return request.get(`${BASE_URL}/blog/list/tags`)
}

export const listPosts = data => {
 return request.get(`${BASE_URL}/blog/list/posts`)
}

export const listPost = data => {
 return request.get(`${BASE_URL}/blog/list/post`, data)
}

export const listPostsOfTag = data => {
 return request.get(`${BASE_URL}/blog/list/postsOfTag`, data)
}
