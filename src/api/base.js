import axios from './interceptor'

const MethodType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const func = (url, method = MethodType.GET, params = {}) => {
  const data = method === 'GET' ? 'params' : 'data';

  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      [data]: params
    })
      .then(res => {
        resolve(res)
      })
      .catch(err => { reject(err) })
  });
}

export const request = {
  get: (url, params = {}) => func(url, MethodType.GET, params),
  post: (url, params = {}) => func(url, MethodType.POST, params),
  put: (url, params = {}) => func(url, MethodType.PUT, params),
  delete: (url, params = {}) => func(url, MethodType.DELETE, params)
}
