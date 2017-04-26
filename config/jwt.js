const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const avatars = require('../app/controllers/avatars').all();
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.HS256_SECRET;
const expiryDate = 86400;

exports.authToken = (req, res) => {
  if (req.body.password && req.body.email) {
    // find the user
    User.findOne({
      email: req.body.email
    }, (error, existingUser) => {
      if (error) {
        throw error;
      }
      if (!existingUser) {
        return res.status(400).json({
          error: 'User not found'
        });
      } else if (!existingUser.authenticate(req.body.password)) {
        return res.status(400).json({
          error: 'Invalid Login details'
        });
      }
        // Create the token
      req.logIn(existingUser, (err) => {
        if (err) {
          throw err;
        }
        const token = jwt.sign(existingUser, secret, {
          expiresIn: expiryDate
        });
          // return the token as JSON
        return res.status(200).json({
          token,
          userId: existingUser.email
        });
      });
    });
  } else {
    return res.status(400).json({
      error: 'Incomplete data'
    });
  }
};

// Routing process of the middleware to verify a user token
exports.checkToken = (req, res, next) => {
    // checking header or url parameters or post parameters for token
  const token = req.body.token || req.query.token ||
      req.headers['x-access-token'];
    // decoding the token
  if (token) {
      // verifies secret and checks
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        return res.status(403).json({
          message: 'Failed to authenticate token.' });
      }
      // if the authentication process was succesful, save to request for use in other routes
      req.decoded = decoded;
      next();
    });
  } else {
      // if there is no token available
      // return an error
    return res.status(403).send({
      message: 'No token returned.'
    });
  }
};

exports.create = (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.json({ success: false, message: 'Incomplete user details' });
  }
  User.findOne({
    email: req.body.email
  }).exec((err, existingUser) => {
    if (err) throw err;
    if (!existingUser) {
      const user = new User(req.body);
      user.avatar = avatars[user.avatar];
      user.provider = 'jwt';

      user.save((err) => {
        if (err) return res.json({ success: false, message: 'Unable to save' });

        req.logIn(user, (err) => {
          if (err) return err;
          const token = jwt.sign(user, secret, {
            expiresIn: 86400
          });
          return res.json({ success: true, message: 'Signed up', token });
        });
      });
    } else {
      return res.json({ success: false,
        message: 'Existing user cannot sign up again. Please sign in' });
    }
  });
};
