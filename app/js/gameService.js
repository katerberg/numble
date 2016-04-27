(function() {
  'use strict';

  angular.module('numbleApp').factory('gameService', function(winService) {
    var state = {
      selected: [],
      score: 0
    };

    function select(item) {
      state.selected.push(item.display);
      state.score += winService.check(state.selected) ? 1 : 0;
    }

    function reset() {
      state.selected.length = 0;
    }

    return {
      select: select,
      reset: reset,
      state: state
    };
  });
})();
