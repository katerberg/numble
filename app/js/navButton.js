(function() {
  'use strict';

  angular.module('numbleApp').directive('navButton', function($location) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'js/navButton.html',
      transclude: true,
      scope: {
        navButtonUrl: '@'
      },
      link: scope => {
        scope.follow = () => {
          $location.url('/' + scope.navButtonUrl);
        };
      }
    };
  });
})();

