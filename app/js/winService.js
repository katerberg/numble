(function() {
  'use strict';

  angular.module('numbleApp').factory('winService', function() {
    function check(selected) {
      if (selected.length !== 3) {
        return false;
      }
      return selected[0] + selected[1] === selected[2] ||
        selected[0] * selected[1] === selected[2];
    }

    return {
      check: check
    };
  });
})();
