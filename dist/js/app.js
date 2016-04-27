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
      var valid = winService.check(values);
      if (valid) {
        state.found.push(values);
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
        default:
          return false;
      }
    }

    function checkForThree(selected) {
      return selected[0] + selected[1] === selected[2] ||
        selected[0] * selected[1] === selected[2];
    }

    return {
      check: check
    };
  });
})();
