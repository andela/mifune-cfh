/**
 * Module dependencies.
 */
/* eslint-disable no-underscore-dangle, valid-jsdoc */
const mongoose = require('mongoose');
const User = mongoose.model('User');
const avatars = require('./avatars').all();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const secret = process.env.HS256_SECRET;
const expiryDate = 86400;
/**
 * Auth callback
 */
exports.authCallback = (req, res) => {
  res.redirect('/chooseavatars');
};

exports.login = (req, res) => {
  if (req.body.password && req.body.email) {
    // find the user
    User.findOne({
      email: req.body.email
    }, (error, existingUser) => {
      if (error) {
        return res.status(500).json({
          error: 'Server Login Error'
        });
      }
      if (!existingUser) {
        return res.status(404).json({
          error: 'User not found'
        });
      }
      if (!existingUser.authenticate(req.body.password)) {
        return res.status(400).json({
          error: 'Invalid Login details'
        });
      }

      const user = {
        id: existingUser._id,
        username: existingUser.name,
        email: existingUser.email
      };
      // Create the token
      const token = jwt.sign({
        user
      }, secret, {
        expiresIn: expiryDate,
        algorithm: 'HS256'
      });
      // return the token as JSON
      return res.status(200).json({
        token,
        user
      });
    });
  } else {
    return res.status(400).json({
      error: 'Incomplete data'
    });
  }
};

/**
 * Show login form
 */

exports.signin = (req, res) => {
  if (!req.user) {
    return res.json({
      success: false,
      message: 'Invalid'
    });
  }
  res.redirect('/#!/app');
};

/**
 * Show sign up form
 */

exports.signup = (req, res) => {
  if (!req.user) {
    res.redirect('/#!/signup');
  } else {
    res.redirect('/#!/app');
  }
};

/**
 * Logout
 */

exports.signout = (req, res) => {
  // req.logout();
  res.redirect('/');
};

/**
 * Session
 */

exports.session = (req, res) => {
  res.redirect('/');
};

/**
 * Check avatar - Confirm if the user who logged in via passport
 * already has an avatar. If they don't have one, redirect them
 * to our Choose an Avatar page.
 */
exports.checkAvatar = (req, res) => {
  if (req.user && req.user._id) {
    User.findOne({
      _id: req.user.id
    })
    .exec((err, user) => {
      if (user.avatar !== undefined) {
        res.redirect('/#!/');
      } else {
        res.redirect('/#!/choose-avatar');
      }
    });
  } else {
    // If user doesn't even exist, redirect to /
    res.redirect('/#!/app');
  }
};

/**
 * Create user
 */

exports.create = (req, res, next) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, existingUser) => {
      if (!existingUser) {
        const user = new User(req.body);
        // Switch the user's avatar index to an actual avatar url
        user.avatar = avatars[user.avatar];
        user.provider = 'local';
        user.save((err) => {
          if (err) {
            return res.render('/#!/signup?error=unknown', {
              errors: err.errors,
              user
            });
          }
          req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect('/#!/');
          });
        });
      } else {
        return res.redirect('/#!/signup?error=existinguser');
      }
    });
  } else {
    return res.redirect('/#!/signup?error=incomplete');
  }
};

/**
 * Create a new user via the signup endpoint.
 */
exports.createUserApi = (req, res) => {
  if (req.body.name && req.body.password && req.body.email) {
    User.findOne({
      email: req.body.email
    }).exec((err, isExistingUser) => {
      if (!isExistingUser) {
        const newUser = new User(req.body);
        newUser.avatar = avatars[req.body.avatar];
        newUser.provider = 'local';
        newUser.save((err, savedUser) => {
          if (err) {
            return res.status(500).json({
              error: 'User not created'
            });
          }

          const user = {
            id: savedUser._id,
            username: savedUser.name,
            email: savedUser.email
          };
          // Otherwise, return a JWT for the newly created user.
          const token = jwt.sign({
            user
          }, secret, {
            expiresIn: expiryDate,
            algorithm: 'HS256'
          });

          return res.status(200).json({
            token,
            user
          });
        });
      } else {
        return res.status(400).json({
          error: 'User already exists'
        });
      }
    });
  } else {
    return res.status(400).json({
      error: 'Incomplete data'
    });
  }
};

/** @returns a redirect response
 * @params req: a request object.
 * @params res: a response object.
 * Assign avatar to user
 */

exports.avatars = (req, res) => {
  // Update the current user's profile to include the avatar choice they've made
  if (req.user && req.user._id && req.body.avatar !== undefined &&
    /\d/.test(req.body.avatar) && avatars[req.body.avatar]) {
    User.findOne({
      _id: req.user._id
    })
    .exec((err, user) => {
      user.avatar = avatars[req.body.avatar];
      user.save();
    });
  }
  return res.redirect('/#!/app');
};

exports.addDonation = (req, res) => {
  if (req.body && req.user && req.user._id) {
    // Verify that the object contains crowdrise data
    if (req.body.amount && req.body.crowdrise_donation_id && req.body.donor_name) {
      User.findOne({
        _id: req.user._id
      })
      .exec((err, user) => {
        // Confirm that this object hasn't already been entered
        let duplicate = false;
        for (let i = 0; i < user.donations.length; i += 1) {
          if (user.donations[i].crowdrise_donation_id === req.body.crowdrise_donation_id) {
            duplicate = true;
          }
        }
        if (!duplicate) {
          user.donations.push(req.body);
          user.premium = 1;
          user.save();
        }
      });
    }
  }
  res.send();
};

/**
 *  Show profile
 */

exports.show = (req, res) => {
  const user = req.profile;

  res.render('users/show', {
    title: user.name,
    user
  });
};

/**
 * Send User
 */

exports.me = (req, res) => {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */

exports.user = (req, res, next, id) => {
  User.findOne({
    _id: id
  })
  .exec((err, user) => {
    if (err) return next(err);
    if (!user) return next(new Error(`Failed to load User ${id}`));
    req.profile = user;
    next();
  });
};

exports.user = (req, res, next, id) => {
  User
    .findOne({
      _id: id
    })
    .exec((err, user) => {
      if (err) return next(err);
      if (!user) return next(new Error(`Failed to load User ${id}`));
      req.profile = user;
      next();
    });
};

exports.retrieveUsers = (req, res) => {
  User.find().exec((err, data) => {
    if (err) return res.status(400).json({ success: false, message: 'An error occurred' });
    return res.status(200).json({ success: true, data });
  });
};

