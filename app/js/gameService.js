(function() {
  'use strict';

  angular.module('numbleApp').factory('gameService', function(winService) {
    var selected = [];

    function select(item) {
      selected.push(item.display);
      console.log(selected);
      return winService.check(selected);
    }

    function reset() {
      selected.length = 0;
    }

    return {
      select: select,
      reset: reset
    };
  });
})();
