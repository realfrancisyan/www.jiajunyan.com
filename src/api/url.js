const LOCAL_ENV = 'http://127.0.0.1:4000';
const PROD_ENV = 'https://api.auracloudapp.com';

export const BASE_URL =
  process.env.REACT_APP_ENV === 'local' ? LOCAL_ENV : PROD_ENV;
