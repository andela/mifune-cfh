const async = require('async');
const _ = require('underscore');
const questions = require(__dirname + '/../../app/controllers/questions.js');
const answers = require(__dirname + '/../../app/controllers/answers.js');
const guestNames = [
  "Disco Potato",
  "Silver Blister",
  "Insulated Mustard",
  "Funeral Flapjack",
  "Toenail",
  "Urgent Drip",
  "Raging Bagel",
  "Aggressive Pie",
  "Loving Spoon",
  "Swollen Node",
  "The Spleen",
  "Dingle Dangle"
];

function Game(gameID, io) {
  this.io = io;
  this.gameID = gameID;
  this.players = []; // Contains array of player models
  this.table = []; // Contains array of {card: card, player: player.id}
  this.winningCard = -1; // Index in this.table
  this.gameWinner = -1; // Index in this.players
  this.winnerAutopicked = false;
  this.czar = -1; // Index in this.players
  this.playerMinLimit = 3;
  this.playerMaxLimit = 6;
  this.pointLimit = 5;
  this.state = "awaiting players";
  this.round = 0;
  this.questions = null;
  this.answers = null;
  this.curQuestion = null;
  this.timeLimits = {
    stateChoosing: 21,
    stateJudging: 16,
    stateResults: 6
  };
  // setTimeout ID that triggers the czar judging state
  // Used to automatically run czar judging if players don't pick before time limit
  // Gets cleared if players finish picking before time limit.
  this.choosingTimeout = 0;
  // setTimeout ID that triggers the result state
  // Used to automatically run result if czar doesn't decide before time limit
  // Gets cleared if czar finishes judging before time limit.
  this.judgingTimeout = 0;
  this.resultsTimeout = 0;
  this.guestNames = guestNames.slice();
}

Game.prototype.payload = () => {
  let players = [];
  this.players.forEach((player,index) => {
    players.push({
      hand: player.hand,
      points: player.points,
      username: player.username,
      avatar: player.avatar,
      premium: player.premium,
      socketID: player.socket.id,
      color: player.color
    });
  });
  return {
    gameID: this.gameID,
    players: players,
    czar: this.czar,
    state: this.state,
    round: this.round,
    gameWinner: this.gameWinner,
    winningCard: this.winningCard,
    winningCardPlayer: this.winningCardPlayer,
    winnerAutopicked: this.winnerAutopicked,
    table: this.table,
    pointLimit: this.pointLimit,
    curQuestion: this.curQuestion
  };
};

Game.prototype.sendNotification = (msg) => {
  this.io.sockets.in(this.gameID).emit('notification', { notification: msg });
};

// Currently called on each joinGame event from socket.js
// Also called on removePlayer IF game is in 'awaiting players' state
Game.prototype.assignPlayerColors = () => {
  this.players.forEach((player, index) => {
    player.color = index;
  });
};

Game.prototype.assignGuestNames = () => {
  const self = this;
  this.players.forEach((player) => {
    if (player.username === 'Guest') {
      const randIndex = Math.floor(Math.random() * self.guestNames.length);
      player.username = self.guestNames.splice(randIndex, 1)[0];
      if (!self.guestNames.length) {
        self.guestNames = guestNames.slice();
      }
    }
  });
};

Game.prototype.prepareGame = () => {
  this.state = 'game in progress';

  this.io.sockets.in(this.gameID).emit('prepareGame',
    {
      playerMinLimit: this.playerMinLimit,
      playerMaxLimit: this.playerMaxLimit,
      pointLimit: this.pointLimit,
      timeLimits: this.timeLimits
    });

  const self = this;
  async.parallel([
    this.getQuestions,
    this.getAnswers
  ],
    (err, results) => {
      if (err) {
        console.log(err);
      }
      self.questions = results[0];
      self.answers = results[1];

      self.startGame();
    });
};

Game.prototype.startGame = () => {
  this.shuffleCards(this.questions);
  this.shuffleCards(this.answers);
  this.stateChoosing(this);
};

Game.prototype.sendUpdate = () => {
  this.io.sockets.in(this.gameID).emit('gameUpdate', this.payload());
};
Game.prototype.CzarCardPick = (self) => {
  if (self.state === 'pick balck card') {
    self.stateChoosing(self);
  }
};

Game.prototype.stateChoosing = (self) => {
  self.state = 'waiting for players to pick';
  self.table = [];
  self.winningCard = -1;
  self.winningCardPlayer = -1;
  self.winnerAutopicked = false;
  self.curQuestion = self.questions.pop();
  if (!self.questions.length) {
    self.getQuestions((err, data) => {
      self.questions = data;
    });
  }
  self.round++;
  self.dealAnswers();
  // Rotate card czar
  if (self.czar >= self.players.length - 1) {
    self.czar = 0;
  } else {
    self.czar++;
  }
  self.sendUpdate();
  self.choosingTimeout = setTimeout(() => {
    self.stateJudging(self);
  }, self.timeLimits.stateChoosing * 1000);
};

Game.prototype.selectFirst = () => {
  if (this.table.length) {
    this.winningCard = 0;
    var winnerIndex = this._findPlayerIndexBySocket(this.table[0].player);
    this.winningCardPlayer = winnerIndex;
    this.players[winnerIndex].points++;
    this.winnerAutopicked = true;
    this.stateResults(this);
  } else {
    // console.log(this.gameID,'no cards were picked!');
    this.stateChoosing(this);
  }
};

Game.prototype.stateJudging = (self) => {
  self.state = "waiting for czar to decide";
  // console.log(self.gameID,self.state);

  if (self.table.length <= 1) {
    // Automatically select a card if only one card was submitted
    self.selectFirst();
  } else {
    self.sendUpdate();
    self.judgingTimeout = setTimeout(() => {
      // Automatically select the first submitted card when time runs out.
      self.selectFirst();
    }, self.timeLimits.stateJudging * 1000);
  }
};

Game.prototype.stateResults = (self) => {
  self.state = 'winner has been chosen';
  console.log(self.state);
  // TODO: do stuff
  let winner = -1;
  for (let i = 0; i < self.players.length; i++) {
    if (self.players[i].points >= self.pointLimit) {
      winner = i;
    }
  }
  self.sendUpdate();
  self.resultsTimeout = setTimeout(() => {
    if (winner !== -1) {
      self.stateEndGame(winner);
    } else {
      self.stateChoosing(self);
    }
  }, self.timeLimits.stateResults * 1000);
};

Game.prototype.stateEndGame = (winner) => {
  this.state = 'game ended';
  this.gameWinne = winner;
  this.sendUpdate();
};

Game.prototype.stateDissolveGame = () => {
  this.state = 'game dissolved';
  this.sendUpdate();
};

Game.prototype.getQuestions = (cb) => {
  questions.allQuestionsForGame((data) => {
    cb(null, data);
  });
};

Game.prototype.getAnswers = (cb) => {
  answers.allAnswersForGame((data) => {
    cb(null, data);
  });
};

Game.prototype.shuffleCards = (cards) => {
  let shuffleIndex = cards.length;
  let temp;
  let randNum;

  while (shuffleIndex) {
    randNum = Math.floor(Math.random() * shuffleIndex--);
    temp = cards[randNum];
    cards[randNum] = cards[shuffleIndex];
    cards[shuffleIndex] = temp;
  }

  return cards;
};

Game.prototype.dealAnswers = (maxAnswers) => {
  maxAnswers = maxAnswers || 10;
  const storeAnswers = (err, data) => {
    this.answers = data;
  };
  for (let i = 0; i < this.players.length; i++) {
    while (this.players[i].hand.length < maxAnswers) {
      this.players[i].hand.push(this.answers.pop());
      if (!this.answers.length) {
        this.getAnswers(storeAnswers);
      }
    }
  }
};

Game.prototype._findPlayerIndexBySocket = (thisPlayer) => {
  let playerIndex = -1;
  _.each(this.players, (player, index) => {
    if (player.socket.id === thisPlayer) {
      playerIndex = index;
    }
  });
  return playerIndex;
};

Game.prototype.pickCards = (thisCardArray, thisPlayer) => {
  // Only accept cards when we expect players to pick a card
  if (this.state === 'waiting for players to pick') {
    // Find the player's position in the players array
    const playerIndex = this._findPlayerIndexBySocket(thisPlayer);
    if (playerIndex !== -1) {
      // Verify that the player hasn't previously picked a card
      let previouslySubmitted = false;
      _.each(this.table, (pickedSet, index) => {
        if (pickedSet.player === thisPlayer) {
          previouslySubmitted = true;
        }
      });
      if (!previouslySubmitted) {
        // Find the indices of the cards in the player's hand (given the card ids)
        const tableCard = [];
        for (let i = 0; i < thisCardArray.length; i++ ) {
          let cardIndex = null;
          for (let j = 0; j < this.players[playerIndex].hand.length; j++) {
            if (this.players[playerIndex].hand[j].id === thisCardArray[i]) {
              cardIndex = j;
            }
          }
          if (cardIndex !== null) {
            tableCard.push(this.players[playerIndex].hand.splice(cardIndex, 1)[0]);
          }
        }
        if (tableCard.length === this.curQuestion.numAnswers) {
          this.table.push({
            card: tableCard,
            player: this.players[playerIndex].socket.id
          });
        }
        if (this.table.length === this.players.length-1) {
          clearTimeout(this.choosingTimeout);
          this.stateJudging(this);
        } else {
          this.sendUpdate();
        }
      }
    }
  } else {
  }
};

Game.prototype.getPlayer = function(thisPlayer) {
  const playerIndex = this._findPlayerIndexBySocket(thisPlayer);
  if (playerIndex > -1) {
    return this.players[playerIndex];
  } else {
    return {};
  }
};

Game.prototype.removePlayer = function(thisPlayer) {
  const playerIndex = this._findPlayerIndexBySocket(thisPlayer);

  if (playerIndex !== -1) {
    // Just used to send the remaining players a notification
    const playerName = this.players[playerIndex].username;

    // If this player submitted a card, take it off the table
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].player === thisPlayer) {
        this.table.splice(i, 1);
      }
    }

    // Remove player from this.players
    this.players.splice(playerIndex, 1);

    if (this.state === 'awaiting players') {
      this.assignPlayerColors();
    }

    // Check if the player is the czar
    if (this.czar === playerIndex) {
      // If the player is the czar...
      // If players are currently picking a card, advance to a new round.
      if (this.state === 'waiting for players to pick') {
        clearTimeout(this.choosingTimeout);
        this.sendNotification('The Czar left the game! Starting a new round.');
        return this.stateChoosing(this);
      } else if (this.state === 'waiting for czar to decide') {
        // If players are waiting on a czar to pick, auto pick.
        this.sendNotification('The Czar left the game! First answer submitted wins!');
        this.pickWinning(this.table[0].card[0].id, thisPlayer, true);
      }
    } else {
      // Update the czar's position if the removed player is above the current czar
      if (playerIndex < this.czar) {
        this.czar--;
      }
      this.sendNotification(playerName + ' has left the game.');
    }

    this.sendUpdate();
  }
};

Game.prototype.pickWinning = (thisCard, thisPlayer, autopicked) => {
  autopicked = autopicked || false;
  const playerIndex = this._findPlayerIndexBySocket(thisPlayer);
  if ((playerIndex === this.czar || autopicked) && this.state === "waiting for czar to decide") {
    let cardIndex = -1;
    _.each(this.table, (winningSet, index) => {
      if (winningSet.card[0].id === thisCard) {
        cardIndex = index;
      }
    });
    if (cardIndex !== -1) {
      this.winningCard = cardIndex;
      const winnerIndex = this._findPlayerIndexBySocket(this.table[cardIndex].player);
      this.sendNotification(this.players[winnerIndex].username + ' has won the round!');
      this.winningCardPlayer = winnerIndex;
      this.players[winnerIndex].points++;
      clearTimeout(this.judgingTimeout);
      this.winnerAutopicked = autopicked;
      this.stateResults(this);
    } else {
    }
  } else {
    // TODO: Do something?
    this.sendUpdate();
  }
};

Game.prototype.killGame = () => {
  clearTimeout(this.resultsTimeout);
  clearTimeout(this.choosingTimeout);
  clearTimeout(this.judgingTimeout);
};

module.exports = Game;
