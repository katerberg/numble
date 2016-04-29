(function() {
  'use strict';

  angular.module('numbleApp').factory('boardService', function() {
    function getBoard(callback) {
      var num = [];
      for (var i = 0; i <= 3; i++) {
        num.push([]);
        for (var j = 0; j <= 3; j++) {
          var myI = i;
          var myJ = j;
          var value = Math.floor(Math.random() * 10);
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

