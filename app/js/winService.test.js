describe('winService', function() {

  var instance,
  rootScope;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(winService) {
    instance = winService;
  }));

  it('instantiates', function() {
    expect(instance).toBeDefined();
  });

  describe('#check()', function() {
    it('is false for 0 inputs', function() {
      expect(instance.check([])).toBeFalsy();
    });

    it('is false for 1 input', function() {
      expect(instance.check([0])).toBeFalsy();
    });

    it('is false for 2 inputs', function() {
      expect(instance.check([0, 0])).toBeFalsy();
    });

    it('is false for 4 inputs', function() {
      expect(instance.check([0, 0, 0, 0])).toBeFalsy();
    });

    it('is true for 3 numbers that add together', function() {
      expect(instance.check([1, 0, 1])).toBeTruthy();
    });

    it('is true for 3 numbers that multiply together', function() {
      expect(instance.check([1, 0, 0])).toBeTruthy();
    });
  });
});
