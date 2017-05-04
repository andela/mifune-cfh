/*eslint-disable */
angular.module('mean.system')
  .controller('IndexController', ['$scope', '$cookies', 'Global', '$http', '$location',
    'socket', 'game', 'AvatarService', '$window',
    function IndexController($scope, $cookies, Global, $http, $location,
      socket, game, AvatarService) {
      $scope.global = Global;
      $scope.errorMsg = '';

      $scope.startGame = () => {
        swal({
          title: 'Are you sure?',
          text: 'You want to start the game now?',
          type: 'success',
          showCancelButton: true,
          confirmButtonColor: '#DD6B55',
          confirmButtonText: 'Yes Am Ready',
          cancelButtonText: 'No, Not Now',
          closeOnConfirm: true,
          closeOnCancel: true
        },
        (isConfirm) => {
          if (isConfirm) {
            $http.post('/api/games/:id/start').then(
              (data) => {
                console.log(data);
                game.startGame();
              },
              (err) => {
                // error here
                console.log("err" + err);
                window.location = '/play';
                console.log(game);
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
