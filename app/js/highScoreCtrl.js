(() => {
'use strict';

angular.module('numbleApp').controller('HighScoreCtrl', function($scope, storageService) {
  $scope.mode = 'weekly';
  $scope.setMode = mode => $scope.mode = mode;
  $scope.scoresRequest = storageService.getWeeklyHighScores();
  $scope.scoresRequest.then(res => $scope.scores = res);
});
})();
