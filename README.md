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


##Things to add

* Should be an indication of what formula was valid after selected
* Clicking the last-selected item should undo
* It would be nice to have more than 2 inputs e.g. 3\*3\*3=27
* Some kind of challenge mode for single player mode (levels allowing multiplication) (e.g. levels allowing multiplication)
* Sharing should allow sharing to a social service via one of [these](https://github.com/720kb/angular-socialshare) [libraries](https://github.com/djds4rce/angular-socialshare).

#Known bugs

* Continuous Mode will auto-select first valid move. It should allow user to choose whether to use move or keep selecting longer string
