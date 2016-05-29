(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', function(boardService, winService, stateService) {
    function makeSelection(item) {
      item.selected = true;
      stateService.state.selected.push(item);
      var values = stateService.state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function(val) {
        if (stateService.state.found.indexOf(val) === -1) {
          stateService.state.found.push(val);
          stateService.state.score += winService.getScore(val);
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
