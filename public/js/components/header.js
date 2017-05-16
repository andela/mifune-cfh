angular.module('mean').component('header', {
  templateUrl: 'views/header.html',
  controller: HeaderController
});

HeaderController.inject = ['$location', 'Global', 'game'];

/**
 * @param {*} $location
 * @param {*} Global
 * @param {*} game
 * @returns {void}
 */
function HeaderController($location, Global, game) {
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
}
