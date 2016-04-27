(function() {
  'use strict';

  angular.module('numbleApp').factory('winService', function() {
    function check(selected) {
      switch (selected.length) {
        case 3:
          return checkForThree(selected);
        default:
          return false;
      }
    }

    function checkForThree(selected) {
      return selected[0] + selected[1] === selected[2] ||
        selected[0] * selected[1] === selected[2];
    }

    return {
      check: check
    };
  });
})();
