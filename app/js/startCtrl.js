(function() {
  'use strict';

  angular.module('numbleApp').controller('StartCtrl', function($scope, $location) {
    function start() {
      $location.url('/play');
    }

    $scope.start = start;
  });
})();
