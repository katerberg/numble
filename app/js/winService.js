(function() {
  'use strict';

  angular.module('numbleApp').factory('winService', function() {
    function isAddable(one, two, result) {
      return one + two === result;
    }
    function isMultiplicable(one, two, result) {
      return one * two === result;
    }

    function checkForN(selected) {
      const len = selected.length,
        max = len - 1;
      const answers = [];
      for (let n = 1; n < max; n++) { // end of first number
        for (let i = max - n; i > 0; i--) { // end of second number
          let firstNum, secondNum, thirdNum;
          firstNum = secondNum = thirdNum = 0;
          for (let first = n - 1; first >= 0; first--) {
            firstNum += selected[n - first - 1] * Math.pow(10, first);
          }
          for (let second = i - 1; second >= 0; second--) {
            secondNum += selected[i - second - 1 + n] * Math.pow(10, second);
          }
          for (let third = i + n; third < len; third++) {
            thirdNum += selected[third] * Math.pow(10, len - third - 1);
          }
          if (isAddable(firstNum, secondNum, thirdNum)) {
            answers.push(firstNum + '+' + secondNum + '=' + thirdNum);
          }
          if (isMultiplicable(firstNum, secondNum, thirdNum)) {
            answers.push(firstNum + '*' + secondNum + '=' + thirdNum);
          }
        }
      }
      return answers;
    }

    function getScore(formula) {
      switch (formula.length - 2) {
        case 3:
          return 1;
        case 4:
          return 3;
        case 5:
          return 5;
        case 6:
          return 10;
        case 7:
          return 15;
        default:
          return 23;
      }
    }

    return {
      check: checkForN,
      getScore: getScore
    };
  });
})();
