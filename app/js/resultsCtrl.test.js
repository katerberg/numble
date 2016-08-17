(function() {
'use strict';
describe('ResultsCtrl', function() {

  var $rootScope,
    $scope,
    $q,
    $location,
    stateService,
    storageService,
    $controller;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(_$controller_, _$rootScope_, _$location_, _stateService_, _storageService_, _$q_) {
    $q = _$q_;
    $controller = _$controller_;
    $location = _$location_;
    stateService = _stateService_;
    storageService = _storageService_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
  }));

  describe('during standup', function() {
    it('stores score', () => {
      const result = $q.defer().promise;
      spyOn(storageService, 'storeScore').and.returnValue(result);

      $controller('ResultsCtrl', {
        $scope: $scope
      });

      expect($scope.storage).toBe(result);
    });

    it('exposes storage location after resolving', function() {
      const deferred = $q.defer(),
        expected = Math.random();
      spyOn(storageService, 'storeScore').and.returnValue(deferred.promise);

      $controller('ResultsCtrl', {
        $scope: $scope
      });
      expect($scope.shareId).toBeUndefined();

      deferred.resolve({name: expected});
      $rootScope.$apply();

      expect($scope.shareId).toBe(expected);
    });
  });

  describe('after standup', function() {
    let ctrl;

    beforeEach(function() {
      spyOn(storageService, 'storeScore').and.returnValue($q.defer().promise);
      ctrl = $controller('ResultsCtrl', {
        $scope: $scope
      });
    });

    it('instantiates', function() {
      expect($scope).toBeDefined();
    });

    describe('#changeGameMode()', function() {
      beforeEach(function() {
        spyOn(stateService, 'resetGame');
        spyOn($location, 'url');
      });

      it('goes back to game page', function() {
        $scope.changeGameMode();

        expect($location.url).toHaveBeenCalledWith('/');
      });

      it('resets state', function() {
        $scope.changeGameMode();

        expect(stateService.resetGame).toHaveBeenCalled();
      });
    });

    describe('#startOver()', function() {
      beforeEach(function() {
        spyOn(stateService, 'resetGame');
        spyOn($location, 'url');
      });

      it('goes back to game page', function() {
        $scope.startOver();

        expect($location.url).toHaveBeenCalledWith('/play');
      });

      it('resets state', function() {
        $scope.startOver();

        expect(stateService.resetGame).toHaveBeenCalled();
      });
    });

    describe('#getShare()', () => {
      it('should turn on visiblity', () => {
        $scope.shareVisible = false;

        $scope.getShare();

        expect($scope.shareVisible).toBeTruthy();
      });
    });
  });
});
})();
