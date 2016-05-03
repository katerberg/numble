(function() {
  'use strict';
  angular.module('numbleApp').config(function(hammerDefaultOptsProvider) {
    var hammerOptions = {recognizers: [
      [Hammer.Tap, {time: 250}]
    ]};
    hammerDefaultOptsProvider.set(hammerOptions);
  });
})();
