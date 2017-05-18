const mongoose = require('mongoose');
const Game = mongoose.model('Game');

/**
 * start game if request is authenticated
 * @return {void}
 * @param {string} req - request from client end.
 * @param {string} res - response send to client end.
 */

exports.save = (req, res) => {
  const { gameID, gameOwerName, gameOwnerId, players, gameWinner, rounds } = req.body;
  const newGame = new Game();
  newGame.gameID = gameID;
  newGame.gameOwnerId = gameOwnerId;
  newGame.gameOwerName = gameOwerName;
  newGame.rounds = rounds;
  newGame.players = players;
  newGame.gameWinner = gameWinner;
  newGame.date = new Date();
  Game.findOne({ gameID })
    .exec((err, game) => {
      if (err) {
        res.status(500).send({ error: 'An error occured' });
      } else if (game) {
        res.status(200).json(game);
      } else {
        newGame.save((err, success) => {
          if (err) {
            res.status(500).send({ error: 'An error occured' });
          } else {
            res.status(200).json(success);
          }
        });
      }
    });
};

exports.retrieveGames = (req, res) => {
  const user = JSON.parse(req.cookies.user);
  const userID = user.id;
  console.log(userID);
  Game.find({ players: { $elemMatch: { userID } } }, (err, data) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else if (data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json('No Game found');
    }
  });
};

exports.getLeaderBoard = (req, res) => {
  Game.find({}, (err, data) => {
    if (err) {
      res.status(500).send({ error: 'An error occured' });
    } else if (data.length > 0) {
      console.log(data);
      res.status(200).json(data);
    } else {
      res.status(404).json('No Game found');
    }
  });
};
