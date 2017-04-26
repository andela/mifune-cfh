angular.module('mean.system')
  .controller('IndexController', ['$scope', '$cookies', 'Global', '$http', '$location',
    'socket', 'game', 'AvatarService', '$window',
    function IndexController($scope, $cookies, Global, $http, $location,
      socket, game, AvatarService) {
      $scope.global = Global;
      $scope.errorMsg = '';

      $scope.playAsGuest = () => {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      $scope.logout = () => {
        $cookies.remove('token');
        $cookies.remove('user');
      };

      $scope.avatars = [];
      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
    }
  ]);
