/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Game Schema
 */
const Game = new Schema({
  gameID: String,
  gameOwerName: String,
  gameOwnerId: String,
  players: [],
  gameWinner: String,
  rounds: Number,
  date: Date
});

mongoose.model('Game', Game);
