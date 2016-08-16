(function() {
  'use strict';

  angular.module('numbleApp').directive('numTimer', function(timeService, $location) {
    return {
      restrict: 'E',
      templateUrl: 'templates/timer.html',
      scope: {},
      link: function($scope) {
        var GAME_TIME = timeService.GAME_TIME;

        timeService.setAlert(function() {
          $location.url('/results');
        });

        $scope.timePercentage = function() {
          return 100 * (timeService.getTime() - 1) / GAME_TIME;
        };
      }
    };
  });
})();
