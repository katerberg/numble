(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope, stateService, $location) {
    function startOver() {
      stateService.reset();
      $location.url('/play');
    }

    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
  });
})();
