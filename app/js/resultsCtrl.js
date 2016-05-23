(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope,
      stateService,
      storageService,
      $location) {

    $scope.storage = storageService.storeScore();
    $scope.storage.then(function(res) {
      $scope.shareId = res.data.name;
    });

    function startOver() {
      stateService.reset();
      $location.url('/play');
    }

    function getShare() {
      //$scope.storage.$$state.status; -1 if not done. 0 if not started. 1 if done.
      return 'http://katerberg.github.io/numble/dist/index.html#/play?goal=' + $scope.shareId;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShare = getShare;
  });
})();
