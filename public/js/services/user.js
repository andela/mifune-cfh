angular.module('mean.system')
  .factory('userService', ['$http', function userService ($http) {
    return {
      signUp: data => $http.post('/api/auth/signup', data),
      signIn: data => $http.post('/api/auth/login', data),
      startGame: data => $http.post('/api/games/:id/start', data),
      retrieveUsers: () => $http.get('/api/search/users')
    };
  }]);
