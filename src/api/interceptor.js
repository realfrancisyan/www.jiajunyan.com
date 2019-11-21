import axios from 'axios';
import { parseToken } from '../common';
import Alert from '../components/Alert';

// const CODEMESSAGE = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// }

// 拦截 request ，设置全局请求为 ajax 请求
axios.interceptors.request.use(config => {
  config.timeout = 40 * 1000; // 40 秒超时
  config.withCredentials = true;

  config.headers['Access-Control-Allow-Origin'] = '*';
  config.headers['Content-Type'] = 'application/json';
  config.headers['X-Requested-With'] = 'XMLHttpRequest';

  let { token } = parseToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

// 拦截响应 response，并做一些错误处理
axios.interceptors.response.use(
  res => {
    const { data } = res;

    // 全局设置错误提示
    switch (data.status) {
      // token 失效
      case 401:
        Alert.open(data.data);
        break;
      case 403:
        const { token } = parseToken();
        if (token) {
          localStorage.removeItem('token');
        }
        window.location.href = '/auth';
        Alert.open(data.data);
        break;

      default:
    }

    return data;
  },
  err => {
    // 这里是返回状态码不为 200 时候的错误处理
    if (err.code === 'ECONNABORTED') {
      console.log('请求超时');
      // 引入 redux，显示状态
    }
    return Promise.reject(err);
  }
);

export default axios;
