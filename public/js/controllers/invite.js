/* global swal, $ */
(function () { // eslint-disable-line
  angular.module('mean.system')
    .controller('InviteController', InviteController);

  InviteController.$inject = ['$scope', '$location', 'game', 'userService', 'Global', 'socket', '$window'];

  /**
   *
   * @param {object} $scope
   * @param {object} $location
   * @param {object} game
   * @param {object} userService
   * @param {object} Global
   * @param {object} socket
   * @param {object} $window
   * @return {void}
   */
  function InviteController($scope, $location, game, userService, Global, socket, $window) {
    const {
      user,
      authenticated
    } = Global.getSavedUser();
    $scope.searchResult = [];
    let retrievedUsers = [];
    $scope.user = JSON.parse(user || JSON.stringify({}));
    $scope.allInvitees = [];
    $scope.searchInput = '';
    $scope.authenticated = authenticated;

    userService.retrieveUsers().then((response) => {
      retrievedUsers = filterRegUsers(response.data.data);
      $scope.searchResult = retrievedUsers;
    }, (err) => {
      $scope.errorMsg = 'An error occured!!! '.concat(err.error);
    });

    const filterRegUsers = data =>
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
            } else {
              swal('Cancelled', 'You chose not to invite players', 'error');
              swal.close();
            }
          });
      }
    });

    $scope.inviteUsers = (iUser) => {
      if ($scope.allInvitees.length < 11) {
        const { host, protocol } = $window.location;
        const gameOwner = $scope.user.username;
        const inviteLink = `${protocol}//${host}/#!/app?game=${game.gameID}`;
        socket.emit('invite', {
          gameOwner,
          link: inviteLink,
          to: iUser.socketID,
          email: iUser.email
        });
        $scope.allInvitees.push(iUser);
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

    $scope.inviteSent = invitedUser =>
      $scope.allInvitees.find(invUser => invUser.email === invitedUser.email);

    $scope.$watch('game.onlineUsers', () => {
      retrievedUsers = filterRegUsers(retrievedUsers.slice());
      $scope.filterUser();
    }, true);
  }
}());
