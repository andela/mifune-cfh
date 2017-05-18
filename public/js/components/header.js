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

  socket.on('newInvite', (data) => {
    // const { host, hash } = $window.location;
    const inviteLink = `/#!/app?game=${data.gameID}`;
    ctrl.inviteTray.push({ link: inviteLink, from: data.gameOwner });
  });

  ctrl.openGame = (link, index) => {
    $window.open(link, '_blank');
    ctrl.inviteTray.splice(index, 1);
  };
}
