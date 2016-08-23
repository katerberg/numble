'use strict';

(function () {
    'use strict';

    angular.module('numbleApp', ['ngRoute', 'angular-intro', 'angular-gestures']);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('boardService', function () {
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
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "$routeParams", "stateService", "storageService", "boardService", "timeService", "selectionService", function ($scope, $routeParams, stateService, storageService, boardService, timeService, selectionService) {

    function select(item) {
      var state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.replace = false;
      selectionService.makeSelection(item);
    }

    function selectVal(i, j) {
      return function () {
        select($scope.state.board[i][j]);
      };
    }

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore($routeParams.goal);
    $scope.scoreStorage.then(function (res) {
      $scope.state.board = boardService.getBoard(selectVal, boardService.parseLayout(res ? res.values : null));
      $scope.goal = res ? res.score : null;
      timeService.startTimer(timeService.GAME_TIME);
    });
    $scope.undo = stateService.undo;
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').config(["hammerDefaultOptsProvider", function (hammerDefaultOptsProvider) {
    var hammerOptions = { recognizers: [[Hammer.Tap, { time: 250 }]] };
    hammerDefaultOptsProvider.set(hammerOptions);
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').controller('ResultsCtrl', ["$scope", "stateService", "storageService", "$location", function ($scope, stateService, storageService, $location) {

    function storeScore() {
      $scope.storage = storageService.storeScore();
      $scope.storage.then(function (res) {
        $scope.shareId = res.name;
      });
    }

    function startOver() {
      stateService.resetGame();
      $location.url('/play');
    }

    function changeGameMode() {
      stateService.resetGame();
      $location.url('/');
    }

    function getShare() {
      if (!$scope.storage) {
        storeScore();
      }
      $scope.shareVisible = true;
    }
    $scope.score = stateService.state.score;
    $scope.startOver = startOver;
    $scope.changeGameMode = changeGameMode;
    $scope.getShare = getShare;

    if (stateService.state.score !== 0) {
      storeScore();
    }
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'partials/start.html',
      controller: 'StartCtrl'
    }).when('/tutorial', {
      templateUrl: 'partials/tutorial.html',
      controller: 'TutorialCtrl'
    }).when('/play', {
      templateUrl: 'partials/game.html',
      controller: 'GameCtrl'
    }).when('/results', {
      templateUrl: 'partials/results.html',
      controller: 'ResultsCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').directive('numSelect', ["$window", function ($window) {
    return {
      restrict: 'A',
      link: function link(scope, element) {
        var selection = $window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element[0]);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('selectionService', ["boardService", "winService", "stateService", "timeService", function (boardService, winService, stateService, timeService) {
    function makeSelection(item) {
      item.selected = true;
      stateService.state.selected.push(item);
      var values = stateService.state.selected.map(function (val) {
        return val.display;
      });
      var valid = winService.check(values);
      valid.forEach(function (val) {
        if (stateService.state.found.indexOf(val) === -1) {
          stateService.state.selected.forEach(function (selected) {
            selected.replace = true;
            if (stateService.state.mode === 'rotating') {
              selected.display = boardService.getNewCellValue();
            }
          });
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
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').controller('StartCtrl', ["$scope", "$location", "stateService", function ($scope, $location, stateService) {
    function start(gameMode) {
      stateService.state.mode = gameMode;
      $location.url('/play');
    }

    function goTo(url) {
      $location.url('/' + url);
    }

    $scope.start = start;
    $scope.goTo = goTo;
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('stateService', function () {
    var state = {
      board: [],
      selected: [],
      found: [],
      mode: 'normal',
      score: 0
    };

    function undo() {
      state.selected.forEach(function (item) {
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
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('storageService', ["$http", "$q", "stateService", function ($http, $q, stateService) {
    var GAMES_URL = 'https://project-8921628173750252600.firebaseio.com/games';

    function storeScore() {
      var displayVals = stateService.state.board.reduce(function (prevArr, arr) {
        return prevArr + arr.reduce(function (prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      var storage = {
        score: stateService.state.score,
        values: displayVals.substring(0, displayVals.length - 1),
        date: new Date() + '',
        mode: stateService.state.mode
      };
      return $http.post(GAMES_URL + '.json', storage).then(function (res) {
        return res.data;
      });
    }

    function getScore(key) {
      if (key) {
        return $http.get(GAMES_URL + '/' + key + '.json').then(function (res) {
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
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('timeService', ["$timeout", function ($timeout) {
    var timeRemaining,
        callbacks = [];

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

    function resetTimer() {
      timeRemaining = 0;
      callbacks.length = 0;
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
      resetTimer: resetTimer,
      setAlert: setAlert,
      startTimer: startTimer,
      GAME_TIME: 60
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').directive('numTimer', ["timeService", "$location", function (timeService, $location) {
    return {
      restrict: 'E',
      templateUrl: 'templates/timer.html',
      scope: {},
      link: function link($scope) {
        var GAME_TIME = timeService.GAME_TIME;

        timeService.setAlert(function () {
          $location.url('/results');
        });

        $scope.timePercentage = function () {
          return 100 * (timeService.getTime() - 1) / GAME_TIME;
        };
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').controller('TutorialCtrl', ["$scope", "$location", "stateService", "storageService", "boardService", "timeService", "tutorialService", "selectionService", function ($scope, $location, stateService, storageService, boardService, timeService, tutorialService, selectionService) {

    var introOptions = {
      steps: [{
        element: 'header',
        intro: 'Welcome to Numble! The goal is to select numbers that add or multiply together into a formula. This sounds complicated, but it\'s not. I promise!',
        position: 'bottom'
      }, {
        element: '#board',
        intro: 'This is the board. You will select adjacent numbers here to create a formula.'
      }, {
        element: '#board div:nth-child(1) span:nth-child(3)',
        intro: 'When you click on this number, you can then click any number next to it.'
      }, {
        element: '#board div:nth-child(1) span:nth-child(1)',
        intro: 'That means this is an invalid selection.'
      }, {
        element: '#board div:nth-child(2) span:nth-child(2)',
        intro: 'But that this is valid!'
      }, {
        element: '#board div:nth-child(2) span:nth-child(3)',
        intro: 'And since 2+3=5, we can select this one to get a point!'
      }, {
        element: 'header h1',
        intro: 'There we go! You get 1 point for a 3 number string, but more the longer you can go.'
      }, {
        element: 'header h1',
        intro: 'Since 8 times 3 is 24, let\'s try to find that on the board.'
      }, {
        element: '#board div:nth-child(4) span:nth-child(3)',
        intro: 'Here\'s an 8...'
      }, {
        element: '#board div:nth-child(4) span:nth-child(4)',
        intro: 'And our 3...'
      }, {
        element: '#board div:nth-child(4) span:nth-child(5)',
        intro: 'The start of our 24...'
      }, {
        element: '#board div:nth-child(5) span:nth-child(4)',
        intro: 'And that\'s the end of 24!'
      }, {
        element: 'header h1',
        intro: 'See how we got more points for that one?'
      }, {
        element: '#game header',
        intro: 'Last thing. You don\'t have infinite time! Whenever you do get an answer, you get back a number of seconds equal to your score.'
      }, {
        element: '#game header',
        intro: 'Time flies like an arrow, but fruit flies like a banana! Go have fun!'
      }, {
        element: '#game header',
        intro: ''
      }],
      showStepNumbers: false,
      showBullets: false,
      disableInteraction: true,
      keyboardNavigation: true,
      exitOnEsc: false,
      exitOnOverlayClick: false
    };

    function select(item) {
      var state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.replace = false;
      selectionService.makeSelection(item);
    }

    function selectVal(i, j) {
      return function () {
        select($scope.state.board[i][j]);
      };
    }

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore();
    $scope.state.board = boardService.getBoard(selectVal, tutorialService.grid);
    $scope.undo = stateService.undo;
    $scope.tutorialOptions = introOptions;

    var currentStep = 0;
    $scope.afterChange = function () {
      switch (currentStep++) {
        case 2:
          select($scope.state.board[0][2]);
          break;
        case 4:
          select($scope.state.board[1][1]);
          break;
        case 6:
          select($scope.state.board[1][2]);
          break;
        case 8:
          select($scope.state.board[3][2]);
          break;
        case 9:
          select($scope.state.board[3][3]);
          break;
        case 10:
          select($scope.state.board[3][4]);
          break;
        case 11:
          select($scope.state.board[4][3]);
          break;
        case 13:
          timeService.startTimer(timeService.GAME_TIME);
          break;
        case 15:
          timeService.resetTimer();
          $location.url('/');
          break;
      }
    };
  }]);
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('tutorialService', function () {
    return {
      grid: [7, 4, 2, 8, 9, 1, 3, 5, 6, 1, 4, 1, 7, 3, 5, 5, 6, 8, 3, 2, 2, 5, 6, 4, 9]
    };
  });
})();
'use strict';

(function () {
  'use strict';

  angular.module('numbleApp').factory('winService', function () {
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
      for (var n = 1; n < max; n++) {
        // end of first number
        for (var i = max - n; i > 0; i--) {
          // end of second number
          var firstNum = void 0,
              secondNum = void 0,
              thirdNum = void 0;
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