angular.module('mean.system')
  .controller('SignInController', ['$scope', 'Global',
    'AvatarService', '$location', 'userService', 'socket',
    function SignInController($scope, Global,
      AvatarService, $location, userService, socket) {
      $scope.avatars = [];
      $scope.errorMessage = '';
      $scope.hideErrorMessage = 'hidden';

      $scope.signUp = () => {
        $location.path('/signup');
      };

      $scope.home = () => {
        $location.path('/');
      };

      $scope.login = () => {
        const data = {
          email: $scope.email,
          password: $scope.password
        };
        userService.signIn(data).then(({ data: { token, user } }) => {
          Global.saveTokenAndUser(token, user);
          socket.emit('loggedIn', user);
          console.log(user, 'log');
          $location.path('/');
        }, (err) => {
          $scope.errorMsg = 'An error occured!!! '.concat(err.error);
        });
      };
    }
  ]);
