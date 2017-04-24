const jwt = require('jsonwebtoken'),
  mongoose = require('mongoose'),
  expiryDate = 86400, // 24hours
  secret = process.env.SECRET,
  User = mongoose.model('User');
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
      return res.redirect('/#!/signup?error=notanexistinguser');
    } else if (existingUser) {
      if (!existingUser.authenticate(req.body.password)) {
        return res.redirect('/#!/signup?error=notanexistinguser');
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
        res.set('x-access-token', token);
        return res.redirect('/#!/');
      });
    }
  });
};
