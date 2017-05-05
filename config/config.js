const _ = require('underscore');

// Load app configuration
/*eslint-disable */
module.exports = _.extend(
    require(`${__dirname}/../config/env/all.js`),
    require(`${__dirname}/../config/env/${process.env.NODE_ENV}.json`) || {});
