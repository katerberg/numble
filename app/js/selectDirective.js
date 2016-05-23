(function() {
  'use strict';

  angular.module('numbleApp').directive('numSelect', function($window) {
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
  });
})();
