angular.module('mean.system')
  .factory('userService', ['$http', function userService ($http) {
    return {
      signUp: data => $http.post('/api/auth/signup', data),
      signIn: data => $http.post('/api/auth/login', data),
      retrieveUsers: () => $http.get('/api/search/users'),
      saveGame: data => $http.post('/api/games', data),
      retrieveGames: () => $http.get('/api/games/history')
    };
  }]);
