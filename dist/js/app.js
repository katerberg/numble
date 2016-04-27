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

  angular.module('numbleApp').controller('GameCtrl', ["$scope", "gameService", function($scope, gameService) {
    function selectVal(i, j) {
      return function() {
        gameService.select($scope.num[i][j]);
      };
    }
    $scope.num = [];
    for (var i = 0; i <= 3; i++) {
      $scope.num.push([]);
      for (var j = 0; j <= 3; j++) {
        var myI = i;
        var myJ = j;
        $scope.num[i][j] = {
          display: Math.floor(Math.random() * 10),
          select: selectVal(i, j)
        };
      }
    }
    $scope.state = gameService.state;

    $scope.reset = gameService.reset;
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('gameService', ["winService", function(winService) {
    var state = {
      selected: [],
      score: 0
    };

    function select(item) {
      state.selected.push(item);
      var valid = winService.check(state.selected.map(function(val) {
        return val.display;
      }));
      state.score += valid ? 1 : 0;
    }

    function reset() {
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
