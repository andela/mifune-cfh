angular.module('mean.system')
  .factory('userService', ['$http', function userService ($http) {
    return {
      signUp: data => $http.post('/api/auth/signup', data)
    };
  }]);
