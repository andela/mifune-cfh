/* global swal, $ */
(function () { // eslint-disable-line
  angular.module('mean.system')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$scope', '$location', 'game', 'userService', 'Global', 'socket'];

  /**
   *
   * @param {object} $scope
   * @param {object} $location
   * @param {object} game
   * @param {object} userService
   * @param {object} Global
   * @param {object} socket
   * @return {void}
   */
  function InviteController($scope, $location, game, userService, Global, socket) {
    const {
      user,
      authenticated
    } = Global.getSavedUser();
    $scope.searchResult = [];
    let retrievedUsers = [];
    $scope.user = JSON.parse(user || JSON.stringify({}));
    $scope.allInvitees = [];
    $scope.searchInput = [];

    userService.retrieveUsers().then((response) => {
      retrievedUsers = test(response.data.data);
      $scope.searchResult = retrievedUsers;
    }, (err) => {
      $scope.errorMsg = 'An error occured!!! '.concat(err.error);
    });

    const test = data =>
      data.filter(user => user._id !== $scope.user.id) // eslint-disable-line
      .map((regUser) => {
        regUser.online = false;
        const online = game.onlineUsers
          .find(onlineUser => onlineUser.email === regUser.email);
        if (online) {
          regUser.socketID = online.socketID;
          regUser.online = true;
        }
        return regUser;
      });


    $scope.openInviteModal = () => {
      // swal('Kudos!', 'Lists of users will be display', 'success');
      $('#inviteModal').modal('show');
    };

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players' && game.players.length < game.playerMinLimit && authenticated && game.playerIndex === 0) {
        swal({
          title: 'friends Needed',
          text: "You'll need 3 or more users to start this game",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes i will invite',
          cancelButtonText: 'No, not interested',
          closeOnConfirm: true,
          closeOnCancel: true
        },
          (isConfirm) => {
            if (isConfirm) {
              $scope.openInviteModal(true);
              // swal.resetDefaults();
            } else {
              swal('Cancelled', 'You chose not to invite players', 'error');
              swal.close();
            }
          });
      }
    });

    $scope.inviteUsers = (iUser) => {
      if ($scope.allInvitees.length < 11) {
        const gameOwner = $scope.user.username;
        socket.emit('invite', {
          gameOwner,
          gameID: game.gameID,
          to: iUser.socketID,
          email: iUser.email
        });
        $scope.allInvitees.push({
          gameID: game.gameID
        });
      } else {
        swal({
          title: 'Maximum number of Invites',
          text: 'Sorry!, You can only invite a maximum of 11 players to this game',
          type: 'warning',
          confirmButtonText: 'ok',
          closeOnConfirm: true,
        });
      }
    };

    $scope.filterUser = () => {
      $scope.searchResult = retrievedUsers
        .filter((userdata) => {
          const name = userdata.name.toLowerCase();
          return name.indexOf($scope.searchInput.toLowerCase()) !== -1;
        });
    };
  }
}());
