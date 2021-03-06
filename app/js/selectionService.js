(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', function(boardService,
        winService,
        stateService,
        timeService) {
    function makeSelection(item) {
      item.selected = true;
      stateService.state.selected.push(item);
      var values = stateService.state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function(val) {
        if (stateService.state.found.indexOf(val) === -1) {
          stateService.state.selected.forEach(function(selected) {
            selected.replace = true;
            if (stateService.state.mode === 'rotating') {
              selected.display = boardService.getNewCellValue();
            }
          });
          if (stateService.state.mode !== 'rotating') {
            stateService.state.found.push(val);
          }
          var score = winService.getScore(val);
          stateService.state.score += score;
          timeService.addTime(score);
          stateService.undo();
        }
      });
    }

    function isValidMove(item, selected) {
      if (item.selected) {
        return false;
      }
      if (selected.length > 0 && !boardService.areTouching(item, selected[selected.length - 1])) {
        return false;
      }
      return true;
    }

    return {
      isValidMove: isValidMove,
      makeSelection: makeSelection
    };
  });
})();
