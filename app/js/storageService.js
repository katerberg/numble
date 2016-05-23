(function() {
  'use strict';

  angular.module('numbleApp').factory('storageService', function($http, stateService) {
    var GAMES_URL = 'https://project-8921628173750252600.firebaseio.com/games.json';

    function storeScore() {
      var displayVals = stateService.state.board.reduce(function(prevArr, arr) {
        return prevArr + arr.reduce(function(prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      var storage = {
        score: stateService.state.score,
        values: displayVals.substring(0, displayVals.length - 1)
      };
      return $http.post(GAMES_URL, storage);
    }

    return {
      storeScore: storeScore
    };
  });
})();
