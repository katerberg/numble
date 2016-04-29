(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope,
        stateService,
        boardService,
        timeService,
        selectionService,
        winService) {
    function selectVal(i, j) {
      return function() {
        select($scope.num[i][j]);
      };
    }

    function select(item) {
      var state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.selected = true;
      state.selected.push(item);
      var values = state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function(val) {
        if (state.found.indexOf(val) === -1) {
          state.found.push(val);
          state.score++;
          stateService.reset();
        }
      });
    }
    timeService.startTimer(30);
    $scope.num = boardService.getBoard(selectVal);
    $scope.state = stateService.state;
    $scope.time = timeService.getTime;
    $scope.reset = stateService.reset;
  });
})();
