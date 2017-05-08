
/**
 * Redirect users to /#!/app (forcing Angular to reload the page)
 * @return {void}
 * @param {string} req - request from client end.
 * @param {string} res - response send to client end.
 */

exports.play = (req, res) => {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/app?custom');
  } else {
    res.redirect('/#!/app');
  }
};

exports.render = (req, res) => {
  res.render('index', {
    user: req.user ? JSON.stringify(req.user) : 'null'
  });

};

exports.gameTour = function(req, res) {
  if (Object.keys(req.query)[0] === 'custom') {
    res.redirect('/#!/gametour');
  } else {
    res.redirect('/#!/gametour');
  }
};
