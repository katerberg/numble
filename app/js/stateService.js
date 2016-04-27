(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function(winService) {
    var state = {
      selected: [],
      score: 0
    };

    function select(item) {
      if (item.selected) {
        return;
      }
      item.selected = true;
      state.selected.push(item);
      var valid = winService.check(state.selected.map(function(val) {
        return val.display;
      }));
      state.score += valid ? 1 : 0;
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
