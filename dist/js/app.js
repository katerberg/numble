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

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "stateService", function($scope, stateService) {
    function selectVal(i, j) {
      return function() {
        stateService.select($scope.num[i][j]);
      };
    }
    $scope.num = [];
    for (var i = 0; i <= 3; i++) {
      $scope.num.push([]);
      for (var j = 0; j <= 3; j++) {
        var myI = i;
        var myJ = j;
        $scope.num[i][j] = {
          x: i,
          y: j,
          display: Math.floor(Math.random() * 10),
          select: selectVal(i, j)
        };
      }
    }
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
      var valuesCombined = values.join(',');
      if (state.found.some(function(foundVal) {
        return foundVal === valuesCombined;
      })) {
        return;
      }
      var valid = winService.check(values);
      if (valid) {
        state.found.push(values.join(','));
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
    function check(selected) {
      switch (selected.length) {
        case 3:
          return checkForThree(selected);
        case 5:
          return checkForFive(selected);
        default:
          return false;
      }
    }
    function isValid(one, two, result) {
      return one + two === result ||
        one * two === result;
    }

    function checkForThree(selected) {
      return isValid(selected[0], selected[1], selected[2]);
    }

    function checkForN(selected) {
      var len = selected.length,
        max = len - 1;
      console.log('pattern = ' + selected.join(','));
      console.log('len = ' + len);
      for (var n = 1; n < max; n++) {
        for (var i = max - n; i > 0; i--) {
          if (n === 3) { //BAD
            var descrip = n + '' + (len - i - n) + i;
            var firstNum = 0;
            for (var first = n - 1; first > 0; first--) {
              console.log(first);
              console.log('sel ' + selected[n -first]);
              console.log('mult  ' + Math.pow(10, (n - 1 - first)));
              firstNum += selected[n - first] * 10^(n-(n - first));
            }
            console.log(descrip);
            console.log('firstnum = ' + firstNum);
          }
        }
      }
    }

    function checkForFive(selected) {
      checkForN(selected);
      var OneThreeOne = isValid(selected[0],
          selected[1] * 100 + selected[2] * 10 + selected[3],
          selected[4]);
      var ThreeOneOne = isValid(selected[0] * 100 + selected[1] * 10 + selected[2],
          selected[3],
          selected[4]);
      var TwoOneTwo = isValid(selected[0] * 10 + selected[1],
          selected[2],
          selected[3] * 10 + selected[4]);
      var OneTwoTwo = isValid(selected[0],
          selected[1] * 10 + selected[2],
          selected[3] * 10 + selected[4]);
      return TwoOneTwo || OneTwoTwo || ThreeOneOne || OneThreeOne;
    }

    return {
      check: check,
      checkForN: checkForN
    };
  });
})();
