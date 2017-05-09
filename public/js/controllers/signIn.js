angular.module('mean.system')
  .controller('SignInController', ['$scope', 'Global',
    'AvatarService', '$location', 'userService',
    function SignInController($scope, Global,
      AvatarService, $location, userService) {
      $scope.avatars = [];
      $scope.errorMessage = '';
      $scope.hideErrorMessage = 'hidden';

      $scope.signUp = () => {
        $location.path('/signup');
      };

      $scope.login = () => {
        const data = {
          email: $scope.email,
          password: $scope.password
        };
        userService.signIn(data).then(({ data: { token, user } }) => {
          Global.saveTokenAndUser(token, user);
          $location.path('/');
        }, (err) => {
          $scope.errorMsg = 'An error occured!!! '.concat(err.error);
        });
      };
    }
  ]);
