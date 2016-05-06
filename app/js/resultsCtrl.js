(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope, $window, stateService, $location) {
    function startOver() {
      stateService.reset();
      $location.url('/play');
    }

    function getShareUrl(score) {
      return 'href://' + $window.location.host + $window.location.pathname + '#play\?share=' + score;
    }

    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShareUrl = getShareUrl;
  });
})();
