(function() {
  'use strict';

  angular.module('numbleApp').factory('gameService', function() {
    var selected = [];

    function select(item) {
      selected.push(item.display);
      console.log(selected);
      if (selected.length > 2) {
        return checkWin();
      }
    }

    function reset() {
      selected.length = 0;
    }

    function checkWin() {
      return true;
    }

    return {
      select: select,
      reset: reset
    };
  });
})();
