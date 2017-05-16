/* global window, angular */
angular.module('mean', ['ngCookies', 'ngResource', 'ngSanitize', 'ui.bootstrap', 'ngRoute', 'mean.system', 'mean.directives', 'angular-intro', 'hl.sticky'])
  .config(['$routeProvider',
    function RouteConfig($routeProvider) {
      $routeProvider
      .when('/', {
        templateUrl: 'views/index.html'
      })
      .when('/app', {
        templateUrl: '/views/app.html',
      })
      .when('/privacy', {
        templateUrl: '/views/privacy.html',
      })
      .when('/bottom', {
        templateUrl: '/views/bottom.html'
      })
      .when('/signin', {
        templateUrl: '/views/signin.html',
        controller: 'SignInController'
      })
      .when('/signup', {
        templateUrl: '/views/signup.html',
        controller: 'SignUpController'
      })
      .when('/choose-avatar', {
        templateUrl: '/views/choose-avatar.html'
      })
      .when('/team', {
        templateUrl: '/views/team.html'
      })
      .when('/gametour', {
        templateUrl: '/views/onboard.html'
      })
      .otherwise({
        redirectTo: '/'
      });
    }
  ]).config(['$locationProvider',
    function AppConfig($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]).run(['$rootScope', function ($rootScope) {
    $rootScope.safeApply = function (fn) {
      const phase = this.$root.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof (fn) === 'function')) {
          fn();
        }
      } else {
        this.$apply(fn);
      }
    };
  }])
  .run(['DonationService', function AppRunBlock(DonationService) {
    window.userDonationCb = function UserDonationCb(donationObject) {
      DonationService.userDonated(donationObject);
    };
  }]);

angular.module('mean.system', []);
angular.module('mean.directives', []);
