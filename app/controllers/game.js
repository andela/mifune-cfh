import Game from '../models/game';

/**
 * start game if request is authenticated
 */
exports.start = (req, res, next) => {
  if (req.isAuthenticated()) {
    const newGame = new Game({
      game_id: req.game,
      gameOwner_id: req.user.id,
      game_players: [],
      game_winner: String,
      date: Date
    });
    newGame.save((err) => {
      if (err) throw (err);
      res.redirect('/play');
    });
  }
  next();
};
