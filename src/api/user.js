import { request } from './base';
import { BASE_URL } from './url';

export const login = (data, useCache = false) => {
  return request.post(`${BASE_URL}/user/login`, data, useCache);
};
