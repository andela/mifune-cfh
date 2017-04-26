angular.module('mean.system')
  .factory('userService', ['$http', $http => ({
    signUp(data) {
      return $http.post('/api/auth/signup', data);
    }
  })]);
