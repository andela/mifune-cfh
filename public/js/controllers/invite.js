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
  function InviteController ($scope, $location, game, userService, Global, socket) {
    const { user, authenticated } = Global.getSavedUser();
    $scope.searchResult = [];
    $scope.user = JSON.parse(user || JSON.stringify({}));
    $scope.allInvitees = [];

    $scope.$watch('game.gameID', () => {
      if (game.gameID && game.state === 'awaiting players' && game.players.length < game.playerMinLimit && authenticated) {
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
              // swal('Kudos!', 'Lists of users will be display', 'success');
              userService.retrieveUsers().then((response) => {
                const registeredUsers = response.data.data;
                $scope.searchResult = registeredUsers
                  .filter(user => user._id !== $scope.user.id) // eslint-disable-line
                  .map((regUser) => {
                    regUser.disabled = true;
                    const online = game.onlineUsers
                    .find(onlineUser => onlineUser.email === regUser.email);
                    if (online) {
                      regUser.socketID = online.socketID;
                      regUser.disabled = false;
                    }
                    return regUser;
                  });
              }, (err) => {
                $scope.errorMsg = 'An error occured!!! '.concat(err.error);
              });
              $('#myModal').modal('show');
            } else {
              swal('Cancelled', 'You chose not to invite players', 'error');
            }
          });
      }
    });

    $scope.inviteUsers = (id) => {
      if ($scope.allInvitees.length < 11) {
        socket.emit('invite', { gameID: game.gameID, to: id });
        $scope.allInvitees.push({ gameID: game.gameID });
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
  }
}());