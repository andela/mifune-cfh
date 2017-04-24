angular.module('mean.system')
  .factory('userService', ['$http', function($http) {
    return {
      signUp: function(data) {
        return $http.post('/api/auth/signup', data);
      }
    };
  }]);
