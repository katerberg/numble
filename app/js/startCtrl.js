(function() {
  'use strict';

  angular.module('numbleApp').controller('StartCtrl', function($scope, $location, stateService) {
    function start(gameMode) {
      stateService.state.mode = gameMode;
      $location.url('/play');
    }

    function goTo(url) {
      $location.url('/' + url);
    }

    $scope.start = start;
    $scope.goTo = goTo;
  });
})();
