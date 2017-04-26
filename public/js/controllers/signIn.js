angular.module('mean.system')
.controller('SignInController', ['$scope', '$cookies', 'Global', '$http', '$location',
  'AvatarService', '$window', 'userService',
  ($scope, $cookies, Global, $http, $location, AvatarService, $window, userService) => {
    $scope.global = Global;
    $scope.avatars = [];
    $scope.errorMessage = '';
    $scope.hideErrorMessage = 'hidden';

    if ($cookies.get('token')) {
      $scope.global.authenticated = true;
    } else {
      $scope.global.authenticated = false;
    }

    $scope.login = () => {
      const user = {
        email: $scope.email,
        password: $scope.password
      };
      userService.sigIn(user).then((response) => {
        if (response.status !== 200) {
          $scope.showError = () => 'invalid';
        } else {
          $cookies.put('token', response.data.token);
          $cookies.put('userId', response.data.userId);
          $location.path('/');
        }
      }, (err) => {
        $scope.errorMsg = 'An error occured!!! '.concat(err.status);
      });
    };

    $scope.logout = () => {
      $cookies.remove('token');
      $cookies.remove('userId');
    };
  }]);
