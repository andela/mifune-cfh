
/**
 *
 * @return {void}
 * @param {any} socket
 */
function Player(socket) {
  this.socket = socket;
  this.hand = [];
  this.points = 0;
  this.username = null;
  this.email = null;
  this.premium = 0;
  this.avatar = null;
  this.userID = null;
  this.color = null;
}

module.exports = Player;
