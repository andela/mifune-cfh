/**
 * Module dependencies.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * Game Schema
 */
const Game = new Schema({
  gameOwnerEmail: String,
  players: [],
  gameWinner: String,
  date: Date
});

mongoose.model('Game', Game);
