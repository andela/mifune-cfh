/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Game Schema
 */
const GameSchema = new Schema({
  game_id: String,
  gameOwner_id: String,
  game_players: [],
  game_winner: String,
  date: Date
});

mongoose.model('Game', GameSchema);
