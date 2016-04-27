(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function(winService, selectionService) {
    var state = {
      selected: [],
      score: 0
    };

    function select(item) {
      if (item.selected) {
        return;
      }
      if (state.selected.length > 0 && !selectionService.areTouching(item, state.selected[state.selected.length - 1])) {
        return;
      }
      item.selected = true;
      state.selected.push(item);
      var valid = winService.check(state.selected.map(function(val) {
        return val.display;
      }));
      if (valid) {
        state.score++;
        reset();
      }
    }

    function reset() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    return {
      select: select,
      reset: reset,
      state: state
    };
  });
})();
