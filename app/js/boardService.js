(function() {
  'use strict';

  angular.module('numbleApp').factory('boardService', function() {
    function getRandomInt(excluded) {
      var maybe = Math.floor(Math.random() * 10);
      if (excluded.indexOf(maybe) !== -1) {
        return getRandomInt(excluded);
      }
      return maybe;
    }

    function getBoard(callback, layout) {
      var num = [];
      var exclude = [];
      for (var i = 0; i <= 4; i++) {
        num.push([]);
        for (var j = 0; j <= 4; j++) {
          var myI = i;
          var myJ = j;
          var nextNum = (layout || []).shift();
          var value = nextNum || getRandomInt(exclude);
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
      areTouching: areTouching,
      parseLayout: parseLayout
    };
  });
})();

