(function() {
  'use strict';

  var numbleApp = angular.module('numbleApp', [
      'ngRoute'
  ]);

  numbleApp.config(["$routeProvider", "$httpProvider", function($routeProvider, $httpProvider) {
    $httpProvider.defaults.cache = true;

    $routeProvider.
      when('/', {
        templateUrl: 'partials/game.html',
        controller: 'GameCtrl'
      }).
    otherwise({
      redirectTo: '/'
    });
  }]);
})();

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


(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "stateService", "boardService", function($scope, stateService, boardService) {
    function selectVal(i, j) {
      return function() {
        stateService.select($scope.num[i][j]);
      };
    }
    $scope.num = boardService.getBoard(selectVal);
    $scope.state = stateService.state;

    $scope.reset = stateService.reset;
  }]);
})();

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


(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', ["winService", "selectionService", function(winService, selectionService) {
    var state = {
      selected: [],
      found: [],
      score: 0
    };

    function select(item) {
      if (item.selected) {
        return;
      }
      if (state.selected.length > 0 && !selectionService.areTouching(item, state.selected[state.selected.length - 1])) {
        return;
      }
      item.selected = true;
      state.selected.push(item);
      var values = state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      var combined = state.found.concat(valid);
      if (combined.length > state.found.length) {
        state.found.length = 0;
        combined.forEach(function(val) {
          state.found.push(val);
        });
        state.score++;
        reset();
      }
    }

    function reset() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    return {
      select: select,
      reset: reset,
      state: state
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('winService', function() {
    function isAddable(one, two, result) {
      return one + two === result;
    }
    function isMultiplicable(one, two, result) {
      return one * two === result;
    }

    function checkForN(selected) {
      var len = selected.length,
        max = len - 1;
      var answers = [];
      for (var n = 1; n < max; n++) { // end of first number
        for (var i = max - n; i > 0; i--) { // end of second number
          var firstNum, secondNum, thirdNum;
          firstNum = secondNum = thirdNum = 0;
          for (var first = n - 1; first >= 0; first--) {
            firstNum += selected[n - first - 1] * Math.pow(10, first);
          }
          for (var second = i - 1; second >= 0; second--) {
            secondNum += selected[i - second - 1 + n] * Math.pow(10, second);
          }
          for (var third = i + n; third < len; third++) {
            thirdNum += selected[third] * Math.pow(10, len - third - 1);
          }
          if (isAddable(firstNum, secondNum, thirdNum)) {
            answers.push(firstNum + '+' + secondNum + '=' + thirdNum);
          }
          if (isMultiplicable(firstNum, secondNum, thirdNum)) {
            answers.push(firstNum + '*' + secondNum + '=' + thirdNum);
          }
        }
      }
      return answers;
    }

    return {
      check: checkForN,
    };
  });
})();
