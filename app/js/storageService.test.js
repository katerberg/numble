(() => {
'use strict';
describe('storageService', () => {

  let instance,
    $q,
    $rootScope,
    $http;

  beforeEach(module('numbleApp'));

  beforeEach(inject( (_$http_, _$q_, _$rootScope_, storageService) => {
    instance = storageService;
    $http = _$http_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('instantiates', () => {
    expect(instance).toBeDefined();
  });

  describe('#getWeeklyHighScores()', () => {
    it('gets and sorts high scores', done =>  {
      const input0 = {
        score: 87
      },
      input1 = {
        score: 53
      },
      input2 = {
        score: 101
      },
      data = {
        'foo': input0,
        'bar': input1,
        'toor': input2
      },
      deferred = $q.defer();
      spyOn($http, 'get').and.returnValue(deferred.promise);
      instance.getWeeklyHighScores().then(val => {
        expect(val[0]).toBe(input2);
        expect(val[1]).toBe(input0);
        expect(val[2]).toBe(input1);
        done();
      });

      expect($http.get)
        .toHaveBeenCalledWith('https://project-8921628173750252600.firebaseio.com/high-scores/weekly.json');
      deferred.resolve({data: data});
      $rootScope.$apply();
    });

    it('limits scores to first 5', done =>  {
      const input0 = {score: 87},
        input1 = {score: 86},
        input2 = {score: 85},
        input3 = {score: 84},
        input4 = {score: 83},
        input5 = {score: 82},
        data = {
          'foo': input0,
          'bar': input1,
          'toor': input2,
          'root': input3,
          'oot': input4,
          'too': input5
        },
        deferred = $q.defer();
      spyOn($http, 'get').and.returnValue(deferred.promise);
      instance.getWeeklyHighScores().then(val => {
        expect(val.length).toEqual(5);
        expect(val[4]).toBe(input4);
        done();
      });

      expect($http.get)
        .toHaveBeenCalledWith('https://project-8921628173750252600.firebaseio.com/high-scores/weekly.json');
      deferred.resolve({data: data});
      $rootScope.$apply();
    });
  });
});
})();
