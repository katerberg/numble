(function() {
  'use strict';

  angular.module('numbleApp').controller('TutorialCtrl', function($scope,
        stateService,
        storageService,
        boardService,
        timeService,
        tutorialService,
        selectionService) {

    function select(item) {
      const state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.replace = false;
      selectionService.makeSelection(item);
    }

    function selectVal(i, j) {
      return function() {
        select($scope.state.board[i][j]);
      };
    }

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore();
    $scope.state.board = boardService.getBoard(selectVal, tutorialService.grid);
    $scope.undo = stateService.undo;
  });
})();
