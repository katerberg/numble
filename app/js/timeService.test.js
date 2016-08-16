(function() {
'use strict';

describe('timeService', function() {

  var instance,
  $timeout;

  beforeEach(module('numbleApp'));

  beforeEach(inject(function(timeService, _$timeout_) {
    instance = timeService;
    $timeout = _$timeout_;
  }));

  it('instantiates', function() {
    expect(instance).toBeDefined();
  });

  it('sets timer and alerts when finishes', function(done) {
    var alerted = false;
    instance.setAlert(function() {
      alerted = true;
      done();
    });

    instance.startTimer(30);
    for (var i = 0; i < 29; i++) {
      $timeout.flush(1000);
    }
    $timeout.flush(999);

    expect(alerted).toBe(false);
    $timeout.flush(1);
  });

  it('gives status of time', function() {
    instance.startTimer(10);
    $timeout.flush(1000);
    $timeout.flush(1000);
    $timeout.flush(1000);

    expect(instance.getTime()).toEqual(7);
  });

  it('allows time to be added', function() {
    instance.startTimer(10);

    instance.addTime(3);

    expect(instance.getTime()).toEqual(13);
  });
});
})();
