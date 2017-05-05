const mongoose = require('mongoose');
const Game = mongoose.model('Game');

/**
 * start game if request is authenticated
 * @return {void}
 * @param {string} req - request from client end.
 * @param {string} res - response send to client end.
 */

exports.start = (req, res) => {
  const newGame = new Game();
  // game_id should use _id
  // this is just a sample data, should be updated for real user
  newGame.gameID = req.body.gameID;
  newGame.gameOwnerId = req.body.gameOwnerId;
  newGame.players = req.body.players;
  newGame.gameWinner = req.body.gameWinner;
  newGame.date = new Date();

  newGame.save((err) => {
    if (err) throw (err);
    res.json(newGame);
  });
};
