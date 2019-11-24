const LOCAL_ENV = 'http://127.0.0.1:4000';
const PROD_ENV = 'http://122.51.168.215:4000';

export const BASE_URL =
  process.env.REACT_APP_ENV === 'local' ? LOCAL_ENV : PROD_ENV;
