(function() {
  'use strict';

  var numbleApp = angular.module('numbleApp', [
      'ngRoute'
  ]);

  numbleApp.config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.cache = true;

    $routeProvider.
      when('/', {
        templateUrl: 'partials/start.html',
        controller: 'StartCtrl'
      }).
      when('/play', {
        templateUrl: 'partials/game.html',
        controller: 'GameCtrl'
      }).
    otherwise({
      redirectTo: '/'
    });
  });
})();
