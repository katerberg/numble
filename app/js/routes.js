(function() {
  'use strict';
  angular.module('numbleApp').config(function($routeProvider, $httpProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/start.html',
        controller: 'StartCtrl'
      }).
    when('/play', {
      templateUrl: 'partials/game.html',
      controller: 'GameCtrl'
    }).
    when('/results', {
      templateUrl: 'partials/results.html',
      controller: 'ResultsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  });
})();
