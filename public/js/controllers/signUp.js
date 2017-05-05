/* global angular */
angular.module('mean.system')
  .controller('SignUpController', ['$scope', 'Global', '$location', 'AvatarService', 'userService',
    function SignUpController ($scope, Global, $location, AvatarService, userService) {
      $scope.avatars = [];
      $scope.errorMessage = '';
      $scope.hideErrorMessage = 'hidden';

      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });

      $scope.signUp = () => {
        const data = {
          name: $scope.name,
          email: $scope.email,
          password: $scope.password,
          avatarId: $scope.avatarId
        };

        userService.signUp(data)
          .then(({ data: { token, user } }) => {
            $scope.hideErrorMessage = 'hidden';
            Global.saveTokenAndUser(token, user);
            $location.path('/');
          }, (error) => {
            // Show the error message area and tell the user the error that occured.
            $scope.hideErrorMessage = '';
            if (error.data.error === 'Incomplete data') {
              $scope.errorMessage = 'Error. You didn\'t specify either your name, email or password.';
            }

            if (error.data.error === 'Not creatable') {
              $scope.errorMessage = 'Error. We have that email in our records already.';
            }
          });
      };

      $scope.setAvatarId = (id) => {
        $scope.avatarId = id;
      };
    }]);
