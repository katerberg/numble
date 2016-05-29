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


(function() {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "$routeParams", "stateService", "storageService", "boardService", "timeService", "selectionService", function($scope,
        $routeParams,
        stateService,
        storageService,
        boardService,
        timeService,
        selectionService) {

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
      selectionService.makeSelection(item);
    }

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore($routeParams.goal);
    $scope.scoreStorage.then(function(res) {
      $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout(res ? res.layout : null));
      $scope.goal = res ? res.score : null;
      timeService.startTimer(timeService.GAME_TIME);
    });
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

  angular.module('numbleApp').controller('ResultsCtrl', ["$scope", "stateService", "storageService", "$location", function($scope,
      stateService,
      storageService,
      $location) {

    function startOver() {
      stateService.resetGame();
      $location.url('/play');
    }

    function getShare() {
      $scope.storage = storageService.storeScore();
      $scope.storage.then(function(res) {
        $scope.shareId = res.name;
      });
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

  angular.module('numbleApp').directive('numSelect', ["$window", function($window) {
    return {
      restrict: 'A',
      link: function(scope, element) {
        var selection = $window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element[0]);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('selectionService', ["boardService", "winService", "stateService", "timeService", function(boardService,
        winService,
        stateService,
        timeService) {
    function makeSelection(item) {
      item.selected = true;
      stateService.state.selected.push(item);
      var values = stateService.state.selected.map(function(val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function(val) {
        if (stateService.state.found.indexOf(val) === -1) {
          if (stateService.state.mode === 'rotating') {
            stateService.state.selected.forEach(function(selected) {
              selected.display = boardService.getNewCellValue();
            });
          }
          if (stateService.state.mode !== 'rotating') {
            stateService.state.found.push(val);
          }
          var score = winService.getScore(val);
          stateService.state.score += score;
          timeService.addTime(score);
          stateService.undo();
        }
      });
    }

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
      isValidMove: isValidMove,
      makeSelection: makeSelection
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').controller('StartCtrl', ["$scope", "$location", "stateService", function($scope, $location, stateService) {
    function start(gameMode) {
      stateService.state.mode = gameMode;
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
      mode: 'normal',
      score: 0
    };

    function undo() {
      state.selected.forEach(function(item) {
        item.selected = false;
      });
      state.selected.length = 0;
    }

    function resetGame() {
      undo();
      state.found.length = 0;
      state.score = 0;
    }

    return {
      undo: undo,
      resetGame: resetGame,
      state: state
    };
  });
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('storageService', ["$http", "$q", "stateService", function($http, $q, stateService) {
    var GAMES_URL = 'https://project-8921628173750252600.firebaseio.com/games';

    function storeScore() {
      var displayVals = stateService.state.board.reduce(function(prevArr, arr) {
        return prevArr + arr.reduce(function(prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      var storage = {
        score: stateService.state.score,
        values: displayVals.substring(0, displayVals.length - 1)
      };
      return $http.post(GAMES_URL + '.json', storage).then(function(res) {
        return res.data;
      });
    }

    function getScore(key) {
      if (key) {
        return $http.get(GAMES_URL + '/' + key + '.json').then(function(res) {
          return res.data;
        });
      } else {
        return $q.resolve();
      }
    }

    return {
      getScore: getScore,
      storeScore: storeScore
    };
  }]);
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

    function startTimer(timeInSeconds) {
      timeRemaining = timeInSeconds;
      $timeout(tickFn, 1000);
    }

    function getTime() {
      return timeRemaining;
    }

    function addTime(timeInSeconds) {
      timeRemaining += timeInSeconds;
    }

    function setAlert(callback) {
      callbacks.push(callback);
    }

    return {
      addTime: addTime,
      getTime: getTime,
      setAlert: setAlert,
      startTimer: startTimer,
      GAME_TIME: 60
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').directive('numTimer', ["timeService", "$location", function(timeService, $location) {
    return {
      restrict: 'E',
      templateUrl: 'templates/timer.html',
      scope: {},
      link: function($scope, element) {
        var GAME_TIME = timeService.GAME_TIME;

        timeService.setAlert(function() {
          $location.url('/results');
        });

        $scope.timePercentage = function() {
          return 100 * (timeService.getTime() - 1) / GAME_TIME;
        };
      }
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

    function getScore(formula) {
      switch (formula.length - 2) {
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
