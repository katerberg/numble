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

    it('is true for 3 numbers that add together', function() {
      expect(instance.check([1, 0, 1])).toBeTruthy();
    });

    it('is true for 3 numbers that multiply together', function() {
      expect(instance.check([1, 0, 0])).toBeTruthy();
    });
  });

  describe('#checkForFive()', function() {
    it('is true for 1 digit times 2 digit into a 2 digit number', function() {
      expect(instance.check([4, 1, 2, 4, 8])).toBeTruthy();
    });

    it('is true for 2 digit times 1 digit into a 2 digit number', function() {
      expect(instance.check([4, 1, 2, 8, 2])).toBeTruthy();
    });

    it('is true for 1 digit times 3 digit into a 1 digit number', function() {
      expect(instance.check([0, 1, 2, 7, 0])).toBeTruthy();
    });

    it('is true for 3 digit times 1 digit into a 1 digit number', function() {
      expect(instance.check([4, 1, 2, 0, 0])).toBeTruthy();
    });

    it('is true for 1 digit times 3 digit into a 1 digit number', function() {
      expect(instance.check([0, 1, 2, 0, 0])).toBeTruthy();
    });

    it('is true for 1 digit plus 2 digit into a 2 digit number', function() {
      expect(instance.check([4, 1, 2, 1, 6])).toBeTruthy();
    });

    it('is true for 2 digit plus 1 digit into a 2 digit number', function() {
      expect(instance.check([4, 1, 2, 4, 3])).toBeTruthy();
    });

    it('is false for non-sensical pattern', function() {
      expect(instance.check([4, 1, 2, 7, 1])).toBeFalsy();
    });
  });
});
