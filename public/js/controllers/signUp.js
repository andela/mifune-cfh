angular.module('mean.system')
.controller('SignUpController', ['$scope', '$cookies', '$location', 'AvatarService', 'userService', function ($scope, $cookies, $location, AvatarService, userService) {
  $scope.avatars = [];
  $scope.errorMessage = '';
  $scope.hideErrorMessage = 'hidden';
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

  $scope.signUp = function() {
    const data = {
      name: $scope.name,
      email: $scope.email,
      password: $scope.password,
      avatarId: $scope.avatarId
    };

    userService.signUp(data)
      .then(function(response) {
        $scope.hideErrorMessage = 'hidden';
        $cookies.put('token', response.data.jwtToken);
        $cookies.putObject('user', response.data.user);
        $location.path('/');
      }, function(error) {
        // Show the error message area and tell the user the error that occured.
        $scope.hideErrorMessage = '';
        if(error.data.error === 'Incomplete data') {
          $scope.errorMessage = 'Error. You didn\'t specify either your name, email or password.'
        }

        if(error.data.error === 'Not creatable') {
          $scope.errorMessage = 'Error. We have that email in our records already.'
        }
      });
  };

  $scope.setAvatarId = function(id) {
    $scope.avatarId = id;
  }
}]);
