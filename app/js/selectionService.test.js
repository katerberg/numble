(function() {
'use strict';
describe('selectionService', function() {

  var instance,
  boardService;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(selectionService, _boardService_) {
    instance = selectionService;
    boardService = _boardService_;
  }));

  it('instantiates', function() {
    expect(instance).toBeDefined();
  });
  describe('#isValidMove()', function() {
    beforeEach(function() {
      spyOn(boardService, 'areTouching');
    });

    it('is false when item is already selected', function() {
      var input = {selected: true};
      boardService.areTouching.and.returnValue(true);

      expect(instance.isValidMove(input, [{}])).toBeFalsy();
    });

    it('is false when item is not touching previous value', function() {
      var input = {another: Math.random()},
        previous = {some: Math.random()};
      boardService.areTouching.and.returnValue(false);

      expect(instance.isValidMove(input, [{}, previous])).toBeFalsy();

      expect(boardService.areTouching).toHaveBeenCalledWith(input, previous);
    });

    it('is true when item is unselected and touching previous value', function() {
      var input = {};
      boardService.areTouching.and.returnValue(true);

      expect(instance.isValidMove(input, [{}])).toBeTruthy();
    });
  });
});
})();
