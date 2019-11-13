import axios from './interceptor';
import { getStorageKey, getResult } from './cache';

const MethodType = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const cacheResult = p => {
  const { url, method, params, resolve, reject, useCache } = p;
  const data = method === 'GET' ? 'params' : 'data';

  // 发请求
  axios({
    url,
    method,
    [data]: params
  })
    .then(res => {
      // 如果要求缓存，才缓存
      if (useCache) {
        // 获取当前时间戳，并保存到 localStorage
        res.timeStamp = new Date().getTime();
        localStorage.setItem(
          getStorageKey(url, method, params),
          JSON.stringify(res)
        );
      }

      resolve(res);
    })
    .catch(err => {
      reject(err);
    });
};

const send = (url, method = MethodType.GET, params = {}, useCache) => {
  return new Promise((resolve, reject) => {
    const p = {
      url,
      method,
      params,
      resolve,
      reject,
      cacheResult,
      useCache
    };
    getResult(p);
  });
};

export const request = {
  get: (url, params = {}, useCache) =>
    send(url, MethodType.GET, params, useCache),
  post: (url, params = {}, useCache) =>
    send(url, MethodType.POST, params, useCache),
  put: (url, params = {}, useCache) =>
    send(url, MethodType.PUT, params, useCache),
  delete: (url, params = {}, useCache) =>
    send(url, MethodType.DELETE, params, useCache)
};
