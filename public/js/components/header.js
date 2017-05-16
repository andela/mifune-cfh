angular.module('mean').component('header', {
  templateUrl: 'views/header.html',
  controller: HeaderController
});

HeaderController.inject = ['$location', 'Global'];

/**
 * @param {*} $location
 * @param {*} Global
 * @returns {void}
 */
function HeaderController($location, Global) {
  const ctrl = this;
  ctrl.showOptions = Global.getSavedUser().authenticated;
  ctrl.location = () => {
    const currentLocation = $location.path();
    return {
      signin: currentLocation !== '/signin',
      signup: currentLocation !== '/signup'
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
}
