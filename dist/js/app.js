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

    function areTouching(firstItem, secondItem) {
      var xDistance = Math.abs(firstItem.x - secondItem.x);
      var yDistance = Math.abs(firstItem.y - secondItem.y);
      return xDistance <= 1 && yDistance <= 1;
    }

    return {
      getBoard: getBoard,
      areTouching: areTouching
    };
  });
})();


(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "stateService", "boardService", "timeService", "selectionService", "winService", function($scope,
        stateService,
        boardService,
        timeService,
        selectionService,
        winService) {
    function selectVal(i, j) {
      return function() {
        select($scope.num[i][j]);
      };
    }

    function select(item) {
      var state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.selected = true;
      state.selected.push(item);
      var values = state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function(val) {
        if (state.found.indexOf(val) === -1) {
          state.found.push(val);
          state.score += winService.getScore(val);
          stateService.reset();
        }
      });
    }
    timeService.setAlert(function() {
      alert('Game Finished. You scored ' + stateService.state.score + ' points.');
    });
    timeService.startTimer(60);
    $scope.num = boardService.getBoard(selectVal);
    $scope.state = stateService.state;
    $scope.time = timeService.getTime;
    $scope.reset = stateService.reset;
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', ["boardService", function(boardService) {
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
  }]);
})();


(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function() {
    var state = {
      selected: [],
      found: [],
      score: 0
    };

    function reset() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    return {
      reset: reset,
      state: state
    };
  });
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('timeService', ["$timeout", function($timeout) {
    var timeRemaining,
    callbacks =  [];

    function tickFn() {
      timeRemaining--;
      if (timeRemaining === 0) {
        while (callbacks.length > 0) {
          callbacks.pop()();
        }
      } else {
        $timeout(tickFn, 1000);
      }
    }

    function startTimer(time) {
      timeRemaining = time;
      $timeout(tickFn, 1000);
    }

    function getTime() {
      return timeRemaining;
    }

    function setAlert(callback) {
      callbacks.push(callback);
    }

    return {
      startTimer: startTimer,
      getTime: getTime,
      setAlert: setAlert
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

    function getScore(number) {
      var n = number.length - 2;
      if (n <= 1) {
        return n;
      }
      var fibo = 1;
      var fiboPrev = 0;
      for (var i = 2; i < n; i++) {
        var temp = fibo;
        fibo += fiboPrev;
        fiboPrev = temp;
      }
      return fibo;
    }

    return {
      check: checkForN,
      getScore: getScore
    };
  });
})();
