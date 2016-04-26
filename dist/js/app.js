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
        if (gameService.select($scope.num[i][j])) {
          $scope.won = true;
        }
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

    $scope.reset = function reset() {
      gameService.reset();
      $scope.won = false;
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('gameService', ["winService", function(winService) {
    var selected = [];

    function select(item) {
      selected.push(item.display);
      console.log(selected);
      return winService.check(selected);
    }

    function reset() {
      selected.length = 0;
    }

    return {
      select: select,
      reset: reset
    };
  }]);
})();

(function() {
  'use strict';

  angular.module('numbleApp').factory('winService', function() {
    function check(selected) {
      if (selected.length !== 3) {
        return false;
      }
      return selected[0] + selected[1] === selected[2] ||
        selected[0] * selected[1] === selected[2];
    }

    return {
      check: check
    };
  });
})();
