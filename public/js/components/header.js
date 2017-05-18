angular.module('mean').component('header', {
  templateUrl: 'views/header.html',
  controller: HeaderController
});

HeaderController.inject = ['$location', 'Global', 'game', 'socket'];

/**
 * @param {*} $location
 * @param {*} Global
 * @param {*} game
 * @param {*} socket
 * @returns {void}
 */
function HeaderController($location, Global, game, socket) {
  const ctrl = this;
  ctrl.showOptions = Global.getSavedUser().authenticated;
  ctrl.location = () => {
    const currentLocation = $location.path();
    return {
      signin: currentLocation !== '/signin',
      signup: currentLocation !== '/signup',
      app: currentLocation.indexOf('/app') > -1
    };
  };

  ctrl.signUp = () => {
    $location.path('/signup');
  };

  ctrl.home = () => {
    $location.path('/');
  };

  ctrl.signIn = () => {
    $location.path('/signin');
  };

  ctrl.logout = () => {
    Global.removeTokenAndUser();
    $location.path('/#');
  };
  ctrl.abandonGame = () => {
    game.leaveGame();
    $location.path('/');
  };
  ctrl.getSavedGames = () => {
    socket.emit('getSavedGames', true);
  };

  ctrl.getDonations = () => {
    socket.emit('getDonations', true);
  };

  ctrl.getLeaderBoard = () => {
    socket.emit('getLeaderBoard', true);
  };
}
