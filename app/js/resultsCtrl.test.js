(() => {
'use strict';
describe('ResultsCtrl', () => {

  let $rootScope,
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

  describe('during standup', () => {
    it('stores score if it is not zero', () => {
      const result = $q.defer().promise;
      stateService.state.score = 1;
      spyOn(storageService, 'storeScore').and.returnValue(result);

      $controller('ResultsCtrl', {
        $scope: $scope
      });

      expect($scope.storage).toBe(result);
    });

    it('does not store score if it is zero', () => {
      stateService.state.score = 0;
      spyOn(storageService, 'storeScore');

      $controller('ResultsCtrl', {
        $scope: $scope
      });

      expect(storageService.storeScore).not.toHaveBeenCalled();
    });

    it('exposes storage location after resolving', () => {
      const deferred = $q.defer(),
        expected = Math.random();
      stateService.state.score = Math.random();
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

  describe('after standup', () => {
    let ctrl;

    beforeEach(() => {
      stateService.state.score = Math.random();
      spyOn(storageService, 'storeScore').and.returnValue($q.defer().promise);
      ctrl = $controller('ResultsCtrl', {
        $scope: $scope
      });
    });

    it('instantiates', () => {
      expect($scope).toBeDefined();
    });

    describe('#changeGameMode()', () => {
      beforeEach(() => {
        spyOn(stateService, 'resetGame');
        spyOn($location, 'url');
      });

      it('goes back to game page', () => {
        $scope.changeGameMode();

        expect($location.url).toHaveBeenCalledWith('/');
      });

      it('resets state', () => {
        $scope.changeGameMode();

        expect(stateService.resetGame).toHaveBeenCalled();
      });
    });

    describe('#startOver()', () => {
      beforeEach(() => {
        spyOn(stateService, 'resetGame');
        spyOn($location, 'url');
      });

      it('goes back to game page', () => {
        $scope.startOver();

        expect($location.url).toHaveBeenCalledWith('/play');
      });

      it('resets state', () => {
        $scope.startOver();

        expect(stateService.resetGame).toHaveBeenCalled();
      });
    });

    describe('#getShare()', () => {
      it('should store score if it was not stored yet', () => {
        const deferred = $q.defer(),
          expected = Math.random();
        $scope.storage = null;
        storageService.storeScore.and.returnValue(deferred.promise);

        $scope.getShare();

        expect($scope.shareId).toBeUndefined();
        deferred.resolve({name: expected});
        $rootScope.$apply();

        expect($scope.shareId).toBe(expected);
        expect($scope.storage).toBe(deferred.promise);
      });

      it('should turn on visiblity', () => {
        $scope.shareVisible = false;

        $scope.getShare();

        expect($scope.shareVisible).toBeTruthy();
      });
    });
  });
});
})();
