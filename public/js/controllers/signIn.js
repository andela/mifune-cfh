angular.module('mean.system')
  .controller('SignInController', ['$scope', '$cookies', 'Global',
    'AvatarService', '$window', 'userService',
    function SignInController($scope, $cookies, Global,
      AvatarService, $window, userService) {
      $scope.global = Global;
      $scope.avatars = [];
      $scope.errorMessage = '';
      $scope.hideErrorMessage = 'hidden';

      $scope.login = () => {
        const user = {
          email: $scope.email,
          password: $scope.password
        };
        userService.signIn(user).then((response) => {
          $cookies.put('token', response.data.token);
          $cookies.putObject('user', response.data.user);
          $window.location.href = '/';
        }, (err) => {
          $scope.errorMsg = 'An error occured!!! '.concat(err.error);
        });
      };
    }
  ]);
