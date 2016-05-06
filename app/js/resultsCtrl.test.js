describe('ResultsCtrl', function() {

  var instance,
    $scope,
    $location,
    stateService,
    $controller;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _stateService_) {
    $controller = _$controller_;
    $location = _$location_;
    stateService = _stateService_;
    $scope = _$rootScope_.$new();
  }));

  describe('after standup', function() {
    var ctrl;

    beforeEach(function() {
      ctrl = $controller('ResultsCtrl', {
        $scope: $scope
      });
    });

    it('instantiates', function() {
      expect($scope).toBeDefined();
    });

    describe('#startOver()', function() {
      beforeEach(function() {
        spyOn(stateService, 'reset');
        spyOn($location, 'url');
      });

      it('goes back to game page', function() {
        $scope.startOver();

        expect($location.url).toHaveBeenCalledWith('/play');
      });

      it('resets state', function() {
        $scope.startOver();

        expect(stateService.reset).toHaveBeenCalled();
      });
    });

    describe('#share()', function() {
      beforeEach(function() {
        spyOn(stateService, 'reset');
        spyOn($location, 'url');
      });

      it('goes back to game page', function() {
        $scope.startOver();

        expect($location.url).toHaveBeenCalledWith('/play');
      });

      it('resets state', function() {
        $scope.startOver();

        expect(stateService.reset).toHaveBeenCalled();
      });
    });
  });
});
