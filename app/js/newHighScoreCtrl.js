(() => {
'use strict';

angular.module('numbleApp').controller('NewHighScoreCtrl', function($scope,
    $location,
    stateService,
    storageService) {

  $scope.score = stateService.state.score;
  $scope.submit = callsign => {
    storageService.submitHighScore(callsign).then(() => $location.url('/high-scores'));
  };
});
})();
