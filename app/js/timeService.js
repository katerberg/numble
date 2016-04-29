(function() {
  'use strict';

  angular.module('numbleApp').factory('timeService', function($timeout) {
    var timeRemaining,
    callbacks =  [];

    function tickFn() {
      timeRemaining--;
      if (timeRemaining === 0) {
        while (callbacks.length > 0) {
          callbacks.pop()();
        }
      } else {
        $timeout(tickFn, 1000);
      }
    }

    function startTimer(time) {
      timeRemaining = time;
      $timeout(tickFn, 1000);
    }

    function getTime() {
      return timeRemaining;
    }

    function setAlert(callback) {
      callbacks.push(callback);
    }

    return {
      startTimer: startTimer,
      getTime: getTime,
      setAlert: setAlert
    };
  });
})();
