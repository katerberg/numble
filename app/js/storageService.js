(() => {
  'use strict';

  angular.module('numbleApp').factory('storageService', function($http, $q, stateService) {
    const PROJECT_URL = 'https://project-8921628173750252600.firebaseio.com',
      GAMES_URL = `${PROJECT_URL}/games`,
      MONTHLY_SCORES_URL = `${PROJECT_URL}/high-scores/monthly/${new Date().getFullYear()}-${new Date().getMonth()}`,
      LIFETIME_SCORES_URL = `${PROJECT_URL}/high-scores/lifetime`;

    function buildStorage(callsign) {
      const displayVals = stateService.state.board.reduce((prevArr, arr) => {
        return prevArr + arr.reduce((prevItem, item) => {
          return prevItem + item.display + ',';
        }, '');
      }, '');
      return {
        callsign: callsign,
        score: stateService.state.score,
        values: displayVals.substring(0, displayVals.length - 1),
        date: new Date() + '',
        mode: stateService.state.mode
      };
    }

    function storeScore() {
      return $http.post(GAMES_URL + '.json', buildStorage()).then(res => res.data);
    }

    function getTopFiveScores(res) {
      if (!res.data) {
        return [];
      }
      return Object.keys(res.data)
        .map(key => res.data[key])
        .sort((a, b) => b.score - a.score)
        .slice(0,5);
    }

    function getMonthlyHighScores() {
      return $http.get(MONTHLY_SCORES_URL + '.json')
        .then(getTopFiveScores);
    }

    function getLifetimeHighScores() {
      return $http.get(LIFETIME_SCORES_URL + '.json')
        .then(getTopFiveScores);
    }

    function submitHighScore(callsign) {
      let lifetime = $http.post(LIFETIME_SCORES_URL + '.json', buildStorage(callsign));
      let monthly = $http.post(MONTHLY_SCORES_URL + '.json', buildStorage(callsign));

      return $q.all([lifetime, monthly]);
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
      getMonthlyHighScores: getMonthlyHighScores,
      getLifetimeHighScores: getLifetimeHighScores,
      submitHighScore: submitHighScore,
      storeScore: storeScore
    };
  });
})();
