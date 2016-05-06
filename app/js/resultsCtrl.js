(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope, $window, stateService, $location) {
    function startOver() {
      stateService.reset();
      $location.url('/play');
    }

    function getShareUrl() {
      return $window.location;
    }

    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShareUrl = getShareUrl;
  });
})();
