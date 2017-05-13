const mongoose = require('mongoose');
const Game = mongoose.model('Game');

/**
 * start game if request is authenticated
 * @return {void}
 * @param {string} req - request from client end.
 * @param {string} res - response send to client end.
 */

exports.save = (req, res) => {
  const newGame = new Game();
  // game_id should use _id
  // this is just a sample data, should be updated for real user
  newGame.gameOwnerEmail = req.body.gameOwnerEmail;
  newGame.players = req.body.players;
  newGame.gameWinner = req.body.gameWinner;
  newGame.date = new Date();
  newGame.save((err, success) => {
    if (err) {
      throw (err);
    } else {
      res.send(success);
    }
  });
};

exports.retrieveGame = (req, res) => {
  const { gameOwnerEmail } = req.query;
  Game.find({ gameOwnerEmail }, (err, data) => {
    if (err) {
      res.send('error ocured');
    } else if (data.length > 0) {
      res.json(data);
    } else {
      res.send('No game found');
    }
  });
};
