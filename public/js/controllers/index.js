/*eslint-disable */
angular.module('mean.system')
  .controller('IndexController', ['$scope', '$cookies', 'Global', '$http', '$location',
    'socket', 'game', 'AvatarService', 'userService',
    function IndexController($scope, $cookies, Global, $http, $location,
      socket, game, AvatarService, userService) {
      $scope.global = Global.isAuthenticated();
      $scope.errorMsg = '';
      $scope.showOptions = !$scope.global.authenticated;
      const user =  $scope.global.user;

      $scope.startGame = () => {
        swal({
          title: 'Start a new Game?',
          text: 'You want to start the game now?',
          type: 'success',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          closeOnConfirm: true,
          closeOnCancel: true
        },
        (isConfirm) => {
          if (isConfirm) {
            const data = {
              gameOwnerId: user.id,
              players: [user.id]
            };
            userService.startGame(data).then(({ data }) => {
              Global.setCurrentGameId(data._id);
              $location.path('/app');
            });
          } else {
            swal('Cancelled', 'You are off! Shitty you!!!', 'error');
          }
        });
      };

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
