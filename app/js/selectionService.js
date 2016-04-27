(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', function() {
    function areTouching(firstItem, secondItem) {
      var xDistance = Math.abs(firstItem.x - secondItem.x);
      var yDistance = Math.abs(firstItem.y - secondItem.y);
      return xDistance <= 1 && yDistance <= 1;
    }

    return {
      areTouching: areTouching
    };
  });
})();

