(() => {
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
      return () => {
        select($scope.state.board[i][j]);
      };
    }

    const introOptions = {
      steps: [{
        element: '#board',
        intro: 'This is the board'
      }]
    };

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore();
    $scope.state.board = boardService.getBoard(selectVal, tutorialService.grid);
    $scope.undo = stateService.undo;
    $scope.tutorialOptions = introOptions;
  });
})();
