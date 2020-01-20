const UpyunService = require('node-upyun-plugin');

const config = {
  name: 'upload-test-jiajun',
  // name: 'jiajunyan',
  operator: 'jiajun',
  password: 'CSCn3zDDqUNQUl6wrDv1xCK00NlBro03'
};

const { name, operator, password } = config;
const folderPath = 'build';

const us = new UpyunService({
  name,
  operator,
  password,
  folderPath
});

us.upload();
