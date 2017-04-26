angular.module('mean.system')
  .factory('userService', ['$http', ($http) => {
    return {
      signUp(data) {
        return $http.post('/api/auth/signup', data);
      }
    };
  }]);
