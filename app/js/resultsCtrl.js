(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope,
      stateService,
      storageService,
      $location) {

    function storeScore() {
      $scope.storage = storageService.storeScore();
      $scope.storage.then(function(res) {
        $scope.shareId = res.name;
      });
    }

    function startOver() {
      $location.url('/play');
    }

    function changeGameMode() {
      $location.url('/');
    }

    function getShare() {
      if (!$scope.storage) {
        storeScore();
      }
      $scope.shareVisible = true;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.changeGameMode = changeGameMode;
    $scope.getShare = getShare;

    if (stateService.state.score !== 0) {
      storeScore();
    }
  });
})();
