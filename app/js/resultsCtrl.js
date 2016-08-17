(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope,
      stateService,
      storageService,
      $location) {

    $scope.storage = storageService.storeScore();
    $scope.storage.then(function(res) {
      $scope.shareId = res.name;
    });

    function startOver() {
      stateService.resetGame();
      $location.url('/play');
    }

    function changeGameMode() {
      stateService.resetGame();
      $location.url('/');
    }

    function getShare() {
      $scope.shareVisible = true;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.changeGameMode = changeGameMode;
    $scope.getShare = getShare;
  });
})();
