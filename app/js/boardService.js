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
    function getBoard(callback) {
      var num = [];
      var exclude = [];
      for (var i = 0; i <= 3; i++) {
        num.push([]);
        for (var j = 0; j <= 3; j++) {
          var myI = i;
          var myJ = j;
          var value = getRandomInt(exclude);
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

    return {
      getBoard: getBoard
    };
  });
})();

