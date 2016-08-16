(() => {
  'use strict';

  angular.module('numbleApp').controller('TutorialCtrl', function($scope,
        $location,
        stateService,
        storageService,
        boardService,
        timeService,
        tutorialService,
        selectionService) {

    const introOptions = {
      steps: [{
        element: 'header',
        intro: 'Welcome to Numble! The goal is to select numbers that add or multiply together into a formula. This sounds complicated, but it\'s not. I promise!',
        position: 'bottom'
      },{
        element: '#board',
        intro: 'This is the board. You will select adjacent numbers here to create a formula.'
      },{
        element: '#board div:nth-child(1) span:nth-child(3)',
        intro: 'When you click on this number, you can then click any number next to it.'
      },{
        element: '#board div:nth-child(1) span:nth-child(1)',
        intro: 'That means this is an invalid selection.'
      },{
        element: '#board div:nth-child(2) span:nth-child(2)',
        intro: 'But that this is valid!'
      },{
        element: '#board div:nth-child(2) span:nth-child(3)',
        intro: 'And since 2+3=5, we can select this one to get a point!'
      },{
        element: 'header h1',
        intro: 'There we go! You get 1 point for a 3 number string, but more the longer you can go.'
      },{
        element: 'header h1',
        intro: 'Since 8 times 3 is 24, let\'s try to find that on the board.'
      },{
        element: '#board div:nth-child(4) span:nth-child(3)',
        intro: 'Here\'s an 8...'
      },{
        element: '#board div:nth-child(4) span:nth-child(4)',
        intro: 'And our 3...'
      },{
        element: '#board div:nth-child(4) span:nth-child(5)',
        intro: 'The start of our 24...'
      },{
        element: '#board div:nth-child(5) span:nth-child(4)',
        intro: 'And that\'s the end of 24!'
      },{
        element: 'header h1',
        intro: 'See how we got more points for that one?'
      },{
        element: '#game header',
        intro: 'Last thing. You don\'t have infinite time! Whenever you do get an answer, you get back a number of seconds equal to your score.'
      },{
        element: '#game header',
        intro: 'Time flies like an arrow, but fruit flies like a banana! Go have fun!'
      }],
      showStepNumbers: false,
      showBullets: false
    };

    function select(item) {
      const state = stateService.state;
      if (!selectionService.isValidMove(item, state.selected)) {
        return;
      }
      item.replace = false;
      selectionService.makeSelection(item);
    }

    function selectVal(i, j) {
      return () => {
        select($scope.state.board[i][j]);
      };
    }

    $scope.state = stateService.state;
    $scope.scoreStorage = storageService.getScore();
    $scope.state.board = boardService.getBoard(selectVal, tutorialService.grid);
    $scope.undo = stateService.undo;
    $scope.tutorialOptions = introOptions;

    let currentStep = 0;
    $scope.afterChange = () => {
      switch (currentStep++) {
        case 2:
          select($scope.state.board[0][2]);
          break;
        case 4:
          select($scope.state.board[1][1]);
          break;
        case 6:
          select($scope.state.board[1][2]);
          break;
        case 8:
          select($scope.state.board[3][2]);
          break;
        case 9:
          select($scope.state.board[3][3]);
          break;
        case 10:
          select($scope.state.board[3][4]);
          break;
        case 11:
          select($scope.state.board[4][3]);
          break;
        case 13:
          timeService.startTimer(timeService.GAME_TIME);
          break;
        case 14:
          $location.url('/');
          break;
      }
    };
  });
})();
