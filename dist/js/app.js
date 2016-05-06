(function() {
  'use strict';

  var numbleApp = angular.module('numbleApp', [
      'ngRoute',
      'angular-gestures'
  ]);
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


(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "$location", "$routeParams", "stateService", "boardService", "timeService", "selectionService", "winService", function($scope,
        $location,
        $routeParams,
        stateService,
        boardService,
        timeService,
        selectionService,
        winService) {
    function selectVal(i, j) {
      return function() {
        select($scope.state.board[i][j]);
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
          stateService.undo();
        }
      });
    }
    timeService.setAlert(function() {
      $location.url('/results');
    });
    timeService.startTimer(60);

    $scope.state = stateService.state;
    $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout($routeParams.layout));
    $scope.time = timeService.getTime;
    $scope.undo = stateService.undo;
  }]);
})();

(function() {
  'use strict';
  angular.module('numbleApp').config(["hammerDefaultOptsProvider", function(hammerDefaultOptsProvider) {
    var hammerOptions = {recognizers: [
      [Hammer.Tap, {time: 250}]
    ]};
    hammerDefaultOptsProvider.set(hammerOptions);
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', ["$scope", "$window", "stateService", "$location", function($scope,
      $window,
      stateService,
      $location) {
    function startOver() {
      stateService.reset();
      $location.url('/play');
    }
    function getShare() {
      var displayVals = stateService.state.board.reduce(function(prevArr, arr) {
        return prevArr + arr.reduce(function(prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      displayVals = displayVals.substring(0, displayVals.length - 1);
      return 'http://katerberg.github.io/numble/dist/index.html#/play?layout=' + displayVals;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.getShare = getShare;
  }]);
})();

(function() {
  'use strict';
  angular.module('numbleApp').config(["$routeProvider", function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/start.html',
        controller: 'StartCtrl'
      }).
    when('/play', {
      templateUrl: 'partials/game.html',
      controller: 'GameCtrl'
    }).
    when('/results', {
      templateUrl: 'partials/results.html',
      controller: 'ResultsCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
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

  angular.module('numbleApp').controller('StartCtrl', ["$scope", "$location", function($scope, $location) {
    function start() {
      $location.url('/play');
    }

    $scope.start = start;
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('stateService', function() {
    var state = {
      board: [],
      selected: [],
      found: [],
      score: 0
    };

    function undo() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    function reset() {
      undo();
      state.found.length = 0;
      state.score = 0;
    }

    return {
      undo: undo,
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
      switch (number.length - 2) {
        case 3:
          return 1;
        case 4:
          return 3;
        case 5:
          return 5;
        case 6:
          return 10;
        case 7:
          return 15;
        default:
          return 23;
      }
    }

    return {
      check: checkForN,
      getScore: getScore
    };
  });
})();
