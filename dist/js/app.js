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
      if (state.found.some(function(foundVal) {return foundVal === valuesCombined;})) {
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
    function isValid(one, two, result) {
      return one + two === result ||
        one * two === result;
    }

    function checkForN(selected) {
      var len = selected.length,
        max = len - 1;
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
          if (isValid(firstNum, secondNum, thirdNum)) {
            return true;
          }
        }
      }
      return false;
    }

    return {
      check: checkForN,
      checkForN: checkForN
    };
  });
})();
