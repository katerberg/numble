(function() {
'use strict';

angular.module('numbleApp').directive('makTouch', function() {
  return {
    restrict: 'A',
    link: function($scope, element, attrs) {
      console.log('bound');
      console.log(element);
      element.on('touchenter', function() {
        alert('entered');
      });
    }
  };
});
})();
