(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', function(boardService) {
    function isValidMove(item, selected) {
      if (item.selected) {
        return false;
      }
      if (selected.length > 0 && !boardService.areTouching(item, selected[selected.length - 1])) {
        return false;
      }
      return true;
    }

    return {
      isValidMove: isValidMove
    };
  });
})();

