/* global window, angular, swal, $ */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', '$window',
    'socket', 'game', 'AvatarService', 'RegionService', 'userService',
    function IndexController($scope, Global, $location, $window,
      socket, game, AvatarService, RegionService) {
      $scope.global = Global.getSavedUser();
      $scope.errorMsg = '';
      $scope.showOptions = !$scope.global.authenticated;
      $scope.gameType = 'guest';
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
              $scope.gameType = gameType;
              displayMessage('#message-modal');
            }
          });
      };

      $scope.gameOn = () => {
        if ($scope.gameType === 'guest') {
          game.joinGame();
          $location.path('/app');
        } else {
          $location.path('/app').search('custom');
        }
      };

      $scope.showError = () => {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      $scope.logout = () => {
        Global.removeTokenAndUser();
        $location.path('/#');
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
      $scope.countries = [];

      RegionService.getCountries()
        .then((data) => {
          $scope.countries = data;
        });

      const displayMessage = (modalID) => {
        $(modalID).modal();
      };

      $scope.$watch('selectedCountry', () => {
        if ($scope.selectedCountry !== null && $scope.selectedCountry !== undefined) {
          socket.emit('region', $scope.selectedCountry);
        }
      });
    }
  ]);
