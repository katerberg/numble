(function() {
  'use strict';

  angular.module('numbleApp').factory('tutorialService', function() {
    return {
      grid: [7, 4, 2, 8, 9, 1, 3, 5, 6, 1, 4, 1, 7, 3, 5, 5, 6, 8, 3, 2, 2, 5, 6, 4, 9]
    };
  });
})();

