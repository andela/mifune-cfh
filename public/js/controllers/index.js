/*eslint-disable */
/* global window, angular */
angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', '$window',
    'socket', 'game', 'AvatarService', 'userService',
    function IndexController($scope, Global, $location, $window,
      socket, game, AvatarService, userService) {
      $scope.global = Global.getSavedUser();
      $scope.errorMsg = '';
      $scope.showOptions = !$scope.global.authenticated;
      $scope.savedGames = [];
      let allSavedGames = [];
      $scope.gameCounter = 0;
      let donationCounter = 0;
      const user =  $scope.global.user;
      const userID = user;
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

      $scope.retrieveGames = () => {
        userService.retrieveGames(userID).then((success) => {
          const games = success.data;
          games.reverse();
          // slice the games into chuncks of game arrays for paginations
          let i;
          let j;
          let gamesChunk;
          let gamesCollection = [];
          let chunk = 10;
          for (i=0,j=games.length; i<j; i+=chunk) {
              gamesChunk = games.slice(i,i+chunk);
              gamesCollection.push(gamesChunk);
          }
          $scope.savedGames = gamesCollection[0];
          $scope.allSavedGames = gamesCollection;
        },
        (err) => {
          console.log(err);
        });
      }

      $scope.nextPage = (item) => {
        const lent = $scope.allSavedGames.length;
        if (item === 'savedGames' && $scope.gameCounter < lent-1) {
          $scope.gameCounter++;
          $scope.savedGames = $scope.allSavedGames[$scope.gameCounter];    
        }
      }

      $scope.previousPage = (item) => {
        if (item === 'savedGames' && $scope.gameCounter > 0) {
          $scope.gameCounter--;
          $scope.savedGames = $scope.allSavedGames[$scope.gameCounter];
        }
      }
      

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

      socket.on('newInvite', (data) => {
        const { host, hash } = $window.location;
        const inviteLink = `${host}/${hash}app?game=${data}`
        console.log(inviteLink);
      })

      socket.on('savedGames', (data) => {
        $scope.retrieveGames();
      });

      socket.on('getDonations', (data) => {
        $scope.getDonations();
      });

      socket.on('getLeaderBoard', (data) => {
        $scope.getLeaderBoard();
      });
    }
  ]);
