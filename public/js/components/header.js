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
 * @param {*} socket
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
      dashboard: currentLocation !== '/dashboard',
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

  ctrl.dashboard = () => {
    $location.path('/dashboard');
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

  socket.on('newInvite', (data) => {
    const inviteLink = `/#!/app?game=${data.gameID}`;
    ctrl.inviteTray.push({ link: inviteLink, from: data.gameOwner });
  });

  ctrl.openGame = (link, index) => {
    $window.open(link, '_blank');
    ctrl.inviteTray.splice(index, 1);
  };
}
