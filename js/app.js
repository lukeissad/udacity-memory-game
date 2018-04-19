/*
 * Create a list that holds all of your cards
 */

let cardDeck = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt', 'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];
let card = "";
let moveCount = 0;
let openCards = [];
let matchedCards = [];
let seconds = 1;
let timeAdd = 0;
let starScore = 3;
const deck = $('.deck');
const restart = $('.restart');
const moves = $('.moves');
const stars = $('.stars');
const timer = $('.timer');
const winScreen = $('.win-screen');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Calls gameStart to create the game grid
gameStart();

// Calls the restartGame function
restart.on('click', restartGame);

// Creates the game grid and sets up an event listener for it
function gameStart() {
  cardDeck = shuffle(cardDeck);
  for (let i = 0; i < cardDeck.length; i++) {
    deck.append(`<li class="card"><i class="fa ${cardDeck[i]}"></i></li>`);
  }
  card = $('.card');
  card.on('click', gotClicked);
}

// Restarts the game
function restartGame() {
  deck.empty().animateCss('flipInY');
  winScreen.empty();
  gameStart();
  openCards = [];
  matchedCards = [];
  moveCount = 0;
  counterUp();
  clearInterval(timeAdd);
  seconds = 0;
  timer.text(seconds);
  seconds = 1;
  starScore = 3;
  stars.find('i').removeClass('fa-star-o').addClass('fa-star');
  winScreen.css('display', 'none');
}

// Reacts to clicks adjusting the classes of cards and calling appropriate functions
function gotClicked() {
  if (moveCount === 0 && openCards.length === 0) {
    timeStart();
  }
  if (!$(this).hasClass('open') && !$(this).hasClass('match')) {
    $(this).addClass('open show').animateCss('flipInY');
    openCards.push($(this));
    if (openCards.length == 2) {
      card.off('click', gotClicked);
      setTimeout(compare, 600);
    }
  }
}

// Compares two cards temporarily stored in openCards array
function compare() {
  if (openCards[0][0].firstChild.className == openCards[1][0].firstChild.className) {
    openCards[0].toggleClass('match open show').animateCss('pulse');
    openCards[1].toggleClass('match open show').animateCss('pulse');
    matchedCards.push(openCards[0]);
    matchedCards.push(openCards[1]);
  } else {
    openCards[0].removeClass('open show').animateCss('flipInY');
    openCards[1].removeClass('open show').animateCss('flipInY');
  }
  openCards = [];
  moveCount++;
  counterUp();
  if (matchedCards.length == 16) {
    clearInterval(timeAdd);
    win();
  }
  card.on('click', gotClicked);
}

// Increases the move count and changes the amount of stars based on your score
function counterUp() {
  moves.text(moveCount);
  if (moveCount == 15 || moveCount == 20) {
    const star = $('.fa-star').last();
    star.toggleClass('fa-star fa-star-o');
    starScore--;
  }
}

// Counts seconds taken to complete the game
function timeStart() {
  timeAdd = setInterval(function() {
    timer.text(seconds);
    seconds++;
  }, 1000);
}

// Creates the contents of the win screen modal.
function win() {
  winScreen.css('display', 'block');
  winScreen.html(`<div class="win-screen-content"><p class="win-heading">Congratulations! You've won!</p>
  <ul class="star-score">
  </ul>
  <p class="win-paragraph">You've finished the game in ${timer.text()} seconds using ${moves.text()} moves.</p>
  <input type="button" class="win-restart-button" value="Play again">`);
  $('.win-restart-button').on('click', restartGame);
  starGenerate();
}

// Creates stars for the win screen modal
function starGenerate() {
  for (let x = starScore; x > 0; x--) {
    $('.star-score').append('<li><i class="fa fa-star big-star"></i></li>');
  }
  for (let y = starScore + 1; y <= 3; y++) {
    $('.star-score').append('<li><i class="fa fa-star-o big-star"></i></li>');
  }
}

// Animate.css code taken from https://github.com/daneden/animate.css
// Animate.css is licensed under the MIT license. http://opensource.org/licenses/MIT
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') callback();
    });

    return this;
  },
});

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
