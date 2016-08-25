(() => {
'use strict';
/* jshint ignore:start */
Date.prototype.getWeek = () => {
  let onejan = new Date(this.getFullYear(), 0, 1);
  return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};
/* jshint ignore:end */
})();
