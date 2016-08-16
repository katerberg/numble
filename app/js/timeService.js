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

    function startTimer(timeInSeconds) {
      timeRemaining = timeInSeconds;
      $timeout(tickFn, 1000);
    }

    function resetTimer() {
      timeRemaining = 0;
      callbacks.length = 0;
    }

    function getTime() {
      return timeRemaining;
    }

    function addTime(timeInSeconds) {
      timeRemaining += timeInSeconds;
    }

    function setAlert(callback) {
      callbacks.push(callback);
    }

    return {
      addTime: addTime,
      getTime: getTime,
      resetTimer: resetTimer,
      setAlert: setAlert,
      startTimer: startTimer,
      GAME_TIME: 60
    };
  });
})();
