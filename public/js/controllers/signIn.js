angular.module('mean.system')
  .controller('SignInController', ['$scope', '$cookies', 'Global', '$location',
    'AvatarService', '$window', 'userService',
    function SignInController($scope, $cookies, Global,
      $location, AvatarService, $window, userService) {
      $scope.global = Global;
      $scope.avatars = [];
      $scope.errorMessage = '';
      $scope.hideErrorMessage = 'hidden';

      $scope.login = () => {
        const user = {
          email: $scope.email,
          password: $scope.password
        };
        userService.sigIn(user).then((response) => {
          $cookies.put('token', response.data.token);
          $cookies.putObject('user', response.data.user);
          $location.path('/');
        }, (err) => {
          $scope.errorMsg = 'An error occured!!! '.concat(err.error);
        });
      };
    }
  ]);
