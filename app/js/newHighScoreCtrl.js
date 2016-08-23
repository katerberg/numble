(() => {
'use strict';

angular.module('numbleApp').controller('NewHighScoreCtrl', function($scope,
    $location,
    stateService,
    storageService) {

  $scope.score = stateService.state.score;
  $scope.submit = () => {
    $location.url('/high-scores');
  };

});
})();
