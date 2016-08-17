#Numble

A web-based arithmatic game where the player connects numbers together into valid equations. For example, pressing 1-7-3-5-1 would be valid because 17 times 3 equals 51. Similarly, 1-7-3-7-4 is valid because 1+73=74.

##Technology

This application is written in AngularJS. It is tested using Jasmine.

To run the application after installing npm, execute the following:

```
npm start
```

To test the application after instal karma-cli globally, run the following:

```
karma start
```


##Known Issues

* Continuous Mode will auto-select first valid move. It should allow user to choose whether to use move or keep selecting longer string
* Should be an indication of what formula was valid after selected
* Clicking the last-selected item should undo
* There should be a high score page showing weekly/monthly/yearly high scores
