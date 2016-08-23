(function() {
  'use strict';
  angular.module('numbleApp').config(function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/start.html',
        controller: 'StartCtrl'
      }).
    when('/tutorial', {
      templateUrl: 'partials/tutorial.html',
      controller: 'TutorialCtrl'
    }).
    when('/new-high-score', {
      templateUrl: 'partials/new-high-score.html',
      controller: 'NewHighScoreCtrl'
    }).
    when('/high-scores', {
      templateUrl: 'partials/high-scores.html',
      controller: 'HighScoreCtrl'
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
