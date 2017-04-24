angular.module('mean.system')
.controller('SignUpController', ['$scope', '$cookies', '$location', 'AvatarService', 'userService', function ($scope, $cookies, $location, AvatarService, userService) {
  $scope.avatars = [];
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
        // $cookies.put('token', response.data.jwtToken);
        // $cookies.putObject('user', response.data.user);
        console.log(response);
        $location.path('/');
      }, function(error) {
        // Tell the user the error that occured.
        console.log(error);
      });
  };

  $scope.setAvatarId = function(id) {
    $scope.avatarId = id;
  }
}]);
