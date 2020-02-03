const UpyunService = require('node-upyun-plugin');

const us = new UpyunService({
  name: 'jiajunyan',
  operator: 'jiajun',
  password: 'CSCn3zDDqUNQUl6wrDv1xCK00NlBro03',
  folderPath: 'build'
});

us.upload({ removeAll: true });
