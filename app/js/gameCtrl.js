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

    var GAME_TIME = 60;

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

    $scope.state = stateService.state;
    if ($routeParams.goal) {
      $scope.scoreStorage = storageService.getScore($routeParams.goal);
      $scope.scoreStorage.then(function(res) {
        $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout(res.layout));
        $scope.goal = res.score;
        timeService.startTimer(GAME_TIME);
      });
    } else {
      $scope.state.board = boardService.getBoard(selectVal);
      timeService.startTimer(GAME_TIME);
    }
    $scope.time = timeService.getTime;
    $scope.timePercentage = function() {
      return 100 * (timeService.getTime() - 1) / GAME_TIME;
    };
    $scope.undo = stateService.undo;
  });
})();
