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
  newGame.gameOwnerId = req.body.gameOwnerId;
  newGame.players = req.body.players;
  newGame.gameWinner = req.body.gameWinner;
  newGame.date = new Date();
  newGame.save((err, success) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else {
      res.status(200).json(success);
    }
  });
};

exports.retrieveGame = (req, res) => {
  const { gameOwnerId } = req.params;
  Game.find({ gameOwnerId }, (err, data) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json('No Game found');
    }
  });
};
