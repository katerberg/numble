(function() {
  'use strict';

  angular.module('numbleApp').controller('TutorialCtrl', function($scope,
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
    $scope.scoreStorage = storageService.getScore();
    $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout());
    $scope.undo = stateService.undo;
  });
})();
