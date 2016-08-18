(() => {
'use strict';

angular.module('numbleApp').controller('HighScoreCtrl', function($scope, storageService) {
  $scope.scoresRequest = storageService.getWeeklyHighScores();
  $scope.scoresRequest.then(res => $scope.scores = res);
});
})();
