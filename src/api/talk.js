import { request } from './base'
import { BASE_URL } from './url'

export const getPosts = data => {
 return request.get(`${BASE_URL}/talk/getPosts`)
}
