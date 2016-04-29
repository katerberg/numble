(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope, stateService, boardService) {
    function selectVal(i, j) {
      return function() {
        stateService.select($scope.num[i][j]);
      };
    }
    $scope.num = boardService.getBoard(selectVal);
    $scope.state = stateService.state;

    $scope.reset = stateService.reset;
  });
})();
