(() => {
  'use strict';

  angular.module('numbleApp').factory('storageService', function($http, $q, stateService) {
    const PROJECT_URL = 'https://project-8921628173750252600.firebaseio.com',
      GAMES_URL = `${PROJECT_URL}/games`,
      WEEKLY_SCORES_URL = `${PROJECT_URL}/high-scores/weekly`;

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
      return $http.post(GAMES_URL + '.json', storage).then(res => res.data);
    }

    function getWeeklyHighScores() {
      return $http.get(WEEKLY_SCORES_URL + '.json')
        .then(res => Object.keys(res.data).map(key => res.data[key]).sort((a, b) => b.score - a.score)
        );
    }

    function getScore(key) {
      if (key) {
        return $http.get(GAMES_URL + '/' + key + '.json').then(res => res.data);
      } else {
        return $q.resolve();
      }
    }

    return {
      getScore: getScore,
      getWeeklyHighScores: getWeeklyHighScores,
      storeScore: storeScore
    };
  });
})();
