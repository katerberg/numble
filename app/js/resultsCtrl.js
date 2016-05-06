(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', function($scope,
      $window,
      stateService,
      $location) {
    function startOver() {
      stateService.reset();
      $location.url('/play');
    }
    function getShare() {
      var displayVals = stateService.state.board.reduce(function(prevArr, arr) {
        return prevArr + arr.reduce(function(prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      displayVals = displayVals.substring(0, displayVals.length - 1);
      return 'http://katerberg.github.io/numble/dist/index.html#/play?layout=' + displayVals;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShare = getShare;
  });
})();
