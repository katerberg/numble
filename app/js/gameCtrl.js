(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope,
        $routeParams,
        stateService,
        storageService,
        boardService,
        timeService,
        selectionService) {

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
      item.replace = false;
      selectionService.makeSelection(item);
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
