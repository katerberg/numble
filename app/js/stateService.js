(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function() {
    var state = {
      board: [],
      selected: [],
      found: [],
      mode: 'normal',
      score: 0
    };

    function undo() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    function resetGame() {
      undo();
      state.found.length = 0;
      state.score = 0;
    }

    return {
      undo: undo,
      resetGame: resetGame,
      state: state
    };
  });
})();
