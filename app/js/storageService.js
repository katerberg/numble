(function() {
  'use strict';

  angular.module('numbleApp').factory('storageService', function($http, $q, stateService) {
    var GAMES_URL = 'https://project-8921628173750252600.firebaseio.com/games';

    function storeScore() {
      var displayVals = stateService.state.board.reduce(function(prevArr, arr) {
        return prevArr + arr.reduce(function(prevItem, item) {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      var storage = {
        score: stateService.state.score,
        values: displayVals.substring(0, displayVals.length - 1),
        date: new Date() + '',
        mode: stateService.state.mode
      };
      return $http.post(GAMES_URL + '.json', storage).then(function(res) {
        return res.data;
      });
    }

    function getScore(key) {
      if (key) {
        return $http.get(GAMES_URL + '/' + key + '.json').then(function(res) {
          return res.data;
        });
      } else {
        return $q.resolve();
      }
    }

    return {
      getScore: getScore,
      storeScore: storeScore
    };
  });
})();
