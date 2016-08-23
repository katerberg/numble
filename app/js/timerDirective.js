(function() {
  'use strict';

  angular.module('numbleApp').directive('numTimer', function(timeService) {
    return {
      restrict: 'E',
      templateUrl: 'templates/timer.html',
      scope: {},
      link: function($scope) {
        const GAME_TIME = timeService.GAME_TIME;

        $scope.timePercentage = () => {
          return 100 * (timeService.getTime() - 1) / GAME_TIME;
        };
      }
    };
  });
})();
