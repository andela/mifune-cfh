const jwt = require('jsonwebtoken'),
  mongoose = require('mongoose'),
  expiryDate = 86400, // 24hours
  secret = process.env.SECRET,
  User = mongoose.model('User'),
  avatars = require('../app/controllers/avatars').all();

// routing process to authenticate users and generate token
exports.authToken = (req, res) => {
  // find the user
  User.findOne({
    email: req.body.email
  }, (error, existingUser) => {
    if (error) {
      throw error;
    }
    if (!existingUser) {
      return res.json({ success: false,
        message: '' });
    } else if (existingUser) {
      if (!existingUser.authenticate(req.body.password)) {
        return res.json({ success: false,
          message: '' });
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
        return res.json({ success: true, message: 'Yay!! Signed up', token });
      });

      //To verify a user token
      const toKen = req.body.token || req.query.token ||
      req.headers['x-access-token'];
    
      // decoding the token
      if (toKen) {
      // verifies secret and checks
      jwt.verify(toKen, secret, (error, decoded) => {
      if (error) {
        return res.status(403).json({
          message: 'Could not authenticate token.' });
      }
      // if the authentication process was succesful, save to request for use in other routes
      req.decoded = decoded;
    });
  } else {
      // return error if no toke available
    return res.status(403).send({
      message: 'No token returned.'
    });
  }
    }
  });
};
