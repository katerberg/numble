(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope,
        $location,
        $routeParams,
        stateService,
        boardService,
        timeService,
        selectionService,
        winService) {
    function selectVal(i, j) {
      return function() {
        select($scope.state.board[i][j]);
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
          state.score += winService.getScore(val);
          stateService.undo();
        }
      });
    }
    timeService.setAlert(function() {
      $location.url('/results');
    });
    timeService.startTimer(60);

    $scope.state = stateService.state;
    $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout($routeParams.layout));
    $scope.time = timeService.getTime;
    $scope.undo = stateService.undo;
  });
})();
