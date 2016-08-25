(() => {
'use strict';

angular.module('numbleApp').controller('HighScoreCtrl', function($scope, $location, storageService) {
  $scope.mode = 'monthly';
  $scope.setMode = mode => $scope.mode = mode;
  $scope.monthlyRequest = storageService.getMonthlyHighScores();
  $scope.monthlyRequest.then(res => $scope.monthlyScores = res);
  $scope.lifetimeRequest = storageService.getLifetimeHighScores();
  $scope.lifetimeRequest.then(res => $scope.lifetimeScores = res);

  function challenge(score) {
    $location.url(`/play?goal=${score.key}`);
  }

  $scope.challenge = challenge;
});
})();
