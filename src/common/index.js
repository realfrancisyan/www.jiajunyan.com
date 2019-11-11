const parseToken = () => {
  const tokenString = localStorage.getItem('token');
  return tokenString ? JSON.parse(tokenString) : {};
};

module.exports = {
  parseToken
};
