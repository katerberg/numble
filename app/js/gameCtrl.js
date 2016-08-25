(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', function($scope,
        $routeParams,
        $location,
        stateService,
        storageService,
        boardService,
        timeService,
        selectionService) {

    function select(item) {
      var state = stateService.state;
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

    timeService.resetTimer();
    timeService.setAlert(() => {
      if (stateService.state.score > $scope.mustBeat.score) {
        $location.url('/new-high-score');
      } else {
        $location.url('/results');
      }
    });
    storageService.getMonthlyHighScores().then(scores => {
      if (scores.length < 5) {
        $scope.mustBeat = {score: 0};
      } else {
        $scope.mustBeat = scores[scores.length -1];
      }
    });

    stateService.resetGame();
    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore($routeParams.goal);
    $scope.scoreStorage.then(function(res) {
      $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout(res ? res.values : null));
      $scope.goal = res ? res.score : null;
      timeService.startTimer(timeService.GAME_TIME);
    });
    $scope.scoreStorage = storageService.getScore($routeParams.goal);
    $scope.undo = stateService.undo;
  });
})();
