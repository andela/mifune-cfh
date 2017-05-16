/* global io */
angular.module('mean.system')
  .factory('socket', ['$rootScope', function socketService ($rootScope) {
    const socket = io.connect();
    return {
      on (eventName, callback) {
        socket.on(eventName, function () { // eslint-disable-line
          const args = arguments;    // eslint-disable-line
          $rootScope.safeApply(() => {
            callback.apply(socket, args);
          });
        });
      },

      emit (eventName, data, callback) {
        socket.emit(eventName, data, function () { // eslint-disable-line
          const args = arguments;       // eslint-disable-line
        });
        $rootScope.safeApply(() => {
          if (callback) {
            callback.apply(socket, args);    // eslint-disable-line 
          }
        });
      },
      removeAllListeners (eventName, callback) {
        socket.removeAllListeners(eventName, function () { // eslint-disable-line
          const args = arguments; // eslint-disable-line
          $rootScope.safeApply(() => {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
