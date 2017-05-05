
/**
 * Module dependencies.
 */
const express = require('express');
const fs = require('fs');
const passport = require('passport');
const logger = require('mean-logger');
const io = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Load configurations
// if test env, load example file
/*eslint-disable */
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
/*eslint-enable */
const config = require('./config/config');
const mongoose = require('mongoose');

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
const modelsPath = `${__dirname}/app/models`;
const walk = function(path) {
  fs.readdirSync(path).forEach((file) => {
    const newPath = `${path}/${file}`;
    const stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)/.test(file)) {
        require(newPath);// eslint-disable-line
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};
walk(modelsPath);

// bootstrap passport config
require('./config/passport')(passport);

const app = express();

app.use((req, res, next) => {
  next();
});

// express settings
require('./config/express')(app, passport, mongoose);

// Start the app by listening on <port>
const port = config.port;
const server = app.listen(port);
const ioObj = io.listen(server, { log: false });
// game logic handled here
require('./config/socket/socket')(ioObj);
console.log(`Express app started on port ${port}`);// eslint-disable-line

// Initializing logger
logger.init(app, passport, mongoose);

// expose app
module.exports = app;

