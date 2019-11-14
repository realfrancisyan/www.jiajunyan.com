const timeout = 30 * 60 * 1000; // 缓存时间（30 分钟）

// 获取特定键
// 如果有 formData，则记得删除
export const getStorageKey = (url, method, params) => {
  return `u:${url},m:${method},p:${JSON.stringify(params)}`;
};

// 获取返回数据，判断是否有缓存
export const getResult = p => {
  const { url, method, params, resolve, cacheResult, useCache } = p;
  let cache = localStorage.getItem(getStorageKey(url, method, params));

  // 如果不使用缓存，直接请求接口
  if (!useCache) {
    cacheResult(p);
    return;
  }

  // 如果没有，则请求接口，并添加时间戳
  if (!cache) {
    cacheResult(p);
    return;
  }

  // 如果有，则拿时间戳对比时间
  cache = JSON.parse(cache);
  const currentTimeStamp = +new Date(); // 当前时间戳

  // 如果在缓存时间外，重新请求
  if (timeout < currentTimeStamp - cache.timeStamp) {
    // 只要缓存失效，该接口下的所有缓存都要删除
    clearCache(new URL(url).pathname);
    cacheResult(p);
    return;
  }

  // 否则，直接拿缓存数据
  resolve(cache);
};

/**
 * 清除某个接口的所有缓存
 * @param {string} urlName 接口名
 */
export const clearCache = urlName => {
  const arr = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      // 找出 u 开头的接口，排除其他无关的 storage item
      if (key[0] === 'u') {
        const url = key.split(',')[0].slice(2);
        // 匹配传入的接口和 storage 存在的值，有则找出来
        if (new URL(url).pathname === urlName) {
          arr.push(key);
        }
      }
    }
  }

  // 删除所有关于该接口的缓存
  arr.forEach(key => {
    localStorage.removeItem(key);
  });
};
