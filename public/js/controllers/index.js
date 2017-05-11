/*eslint-disable */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location',
    'socket', 'game', 'AvatarService', 'userService',
    function IndexController($scope, Global, $location,
      socket, game, AvatarService, userService) {
      $scope.global = Global.isAuthenticated();
      $scope.errorMsg = '';
      $scope.showOptions = !$scope.global.authenticated;
      const user =  $scope.global.user;
      $scope.startGame = (gameType) => {
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
            if (gameType === 'guest'){
              game.joinGame();
              $location.path('/app');
            }else{
              $location.path('/app').search('custom');
            }
          }
        });
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      $scope.logout = () => {
        Global.removeTokenAndUser();
        $location.path('/#')
      };
      
      $scope.signIn = () => {
        $location.path('/signin');
      };
      $scope.signUp = () => {
        $location.path('/signup');
      };

      $scope.avatars = [];
      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
    }
  ]);
