(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope,
        $location,
        $routeParams,
        stateService,
        storageService,
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

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore($routeParams.goal);
    $scope.scoreStorage.then(function(res) {
      $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout(res ? res.layout : null));
      $scope.goal = res ? res.score : null;
      timeService.startTimer(timeService.GAME_TIME);
    });
    $scope.undo = stateService.undo;
  });
})();
