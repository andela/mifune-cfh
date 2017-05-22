/* eslint-disable valid-jsdoc */
angular.module('mean').component('header', {
  templateUrl: 'views/header.html',
  controller: HeaderController
});

HeaderController.inject = ['$location', 'Global', 'game', '$window', 'socket'];

/**
 * @param {*} $location
 * @param {*} Global
 * @param {*} game
 * @returns {void}
 */
function HeaderController($location, Global, game, $window, socket) {
  const ctrl = this;
  ctrl.inviteTray = [];
  ctrl.showOptions = Global.getSavedUser().authenticated;
  ctrl.location = () => {
    const currentLocation = $location.path();
    return {
      signin: currentLocation !== '/signin',
      signup: currentLocation !== '/signup',
      app: currentLocation.indexOf('/app') > -1,
      dashboard: currentLocation !== '/dashboard',
      backToGame: currentLocation === '/dashboard'
    };
  };

  ctrl.dashboard = () => {
    ctrl.getSavedGames();
    ctrl.getLeaderBoard();
    ctrl.getDonations();
    $location.path('/dashboard');
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

  socket.on('newInvite', (data) => {
    ctrl.inviteTray.push({ link: data.link, from: data.gameOwner });
  });

  ctrl.openGame = (link, index) => {
    $window.open(link, '_blank');
    ctrl.inviteTray.splice(index, 1);
  };
}
