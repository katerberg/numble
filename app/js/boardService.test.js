(function() {
'use strict';
describe('boardService', function() {

  var instance;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(boardService) {
    instance = boardService;
  }));

  it('instantiates', function() {
    expect(instance).toBeDefined();
  });

  describe('#areTouching()', function() {
    var first, second;
    beforeEach(function() {
      first = {};
      second = {};
    });

    it('is true if items are horizontally next', function() {
      first.x = 2;
      first.y = 0;
      second.x = 1;
      second.y = 0;

      expect(instance.areTouching(first, second)).toBeTruthy();
    });

    it('is true if items are vertically next', function() {
      first.x = 1;
      first.y = 2;
      second.x = 1;
      second.y = 3;

      expect(instance.areTouching(first, second)).toBeTruthy();
    });

    it('is true if items are diagonal', function() {
      first.x = 0;
      first.y = 1;
      second.x = 1;
      second.y = 2;

      expect(instance.areTouching(first, second)).toBeTruthy();
    });

    it('is false if items are away from each other', function() {
      first.x = 0;
      first.y = 0;
      second.x = 1;
      second.y = 2;

      expect(instance.areTouching(first, second)).toBeFalsy();
    });
  });

  describe('#parseLayout()', function() {
    it('handles null', function() {
      expect(instance.parseLayout()).toBeUndefined();
    });

    it('parses comma separated list', function() {
      expect(instance.parseLayout('1,2,3,6')).toEqual(['1', '2', '3', '6']);
    });
  });
});
})();
