(function() {
  'use strict';

  angular.module('numbleApp').factory('boardService', function() {
    var exclude = [];
    function getNewCellValue() {
      var maybe = Math.floor(Math.random() * 10);
      if (exclude.indexOf(maybe) !== -1) {
        return getNewCellValue();
      }
      return maybe;
    }

    function getBoard(callback, layout) {
      var num = [];
      for (var i = 0; i <= 4; i++) {
        num.push([]);
        for (var j = 0; j <= 4; j++) {
          var myI = i;
          var myJ = j;
          var nextNum = (layout || []).shift();
          var value = nextNum || getNewCellValue();
          if (value === 0) {
            exclude.push(0);
          }
          num[i][j] = {
            x: i,
            y: j,
            display: value,
            select: callback(i, j)
          };
        }
      }
      return num;
    }

    function areTouching(firstItem, secondItem) {
      var xDistance = Math.abs(firstItem.x - secondItem.x);
      var yDistance = Math.abs(firstItem.y - secondItem.y);
      return xDistance <= 1 && yDistance <= 1;
    }

    function parseLayout(layoutString) {
      if (layoutString) {
        return layoutString.split(',');
      }
    }

    return {
      getBoard: getBoard,
      getNewCellValue: getNewCellValue,
      areTouching: areTouching,
      parseLayout: parseLayout
    };
  });
})();

