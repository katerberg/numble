(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function() {
    var state = {
      selected: [],
      found: [],
      score: 0
    };

    function undo() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    return {
      undo: undo,
      state: state
    };
  });
})();
