(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope, gameService) {
    function selectVal(i, j) {
      return function() {
        gameService.select($scope.num[i][j]);
      };
    }
    $scope.num = [];
    for (var i = 0; i <= 3; i++) {
      $scope.num.push([]);
      for (var j = 0; j <= 3; j++) {
        var myI = i;
        var myJ = j;
        $scope.num[i][j] = {
          x: i,
          y: j,
          display: Math.floor(Math.random() * 10),
          select: selectVal(i, j)
        };
      }
    }
    $scope.state = gameService.state;

    $scope.reset = gameService.reset;
  });
})();
