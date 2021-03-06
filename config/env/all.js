const path = require('path');
rootPath = path.normalize(__dirname + '/../..');
const keys = rootPath + '/keys.txt';
require('dotenv').config();

module.exports = {
	root: rootPath,
	port: process.env.PORT || 3000,
    db: process.env.MONGOHQ_URL
};
