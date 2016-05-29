(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope,
      stateService,
      storageService,
      $location) {

    function startOver() {
      stateService.resetGame();
      $location.url('/play');
    }

    function getShare() {
      $scope.storage = storageService.storeScore();
      $scope.storage.then(function(res) {
        $scope.shareId = res.name;
      });
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShare = getShare;
  });
})();
