describe('winService', function() {

  var instance;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(winService) {
    instance = winService;
  }));

  it('instantiates', function() {
    expect(instance).toBeDefined();
  });

  describe('#getScore()', function() {
    it('give 1 point for 3 numbers', function() {
      expect(instance.getScore('2+4=6')).toEqual(1);
    });

    it('give 3 points for 4 numbers', function() {
      expect(instance.getScore('9+4=13')).toEqual(3);
    });

    it('give 5 points for 5 numbers', function() {
      expect(instance.getScore('1*48=48')).toEqual(5);
    });

    it('give 10 points for 6 numbers', function() {
      expect(instance.getScore('12+48=60')).toEqual(10);
    });

    it('give 15 points for 7 numbers', function() {
      expect(instance.getScore('122+2=124')).toEqual(15);
    });

    it('give 23 points for 8 numbers', function() {
      expect(instance.getScore('122+12=134')).toEqual(23);
    });
  });
});
