/* eslint-disable indent */
'use strict';

const radioBtns = document.querySelectorAll('input[name=cards-number]');
const startBtn = document.querySelector('#start-btn');
const cardsContainer = document.querySelector('.cards__list');
let cards = [];
let gameSize = 0;
let saveData = [];

const getGameSize = () => {
  for (const radio of radioBtns) {
    if (radio.checked) {
      gameSize = parseInt(radio.value);
    }
  }
  return gameSize;
};

const createCard = (card) => {
	const frontCard = document.createElement('div');
	frontCard.classList.add('hidden');
  const frontCardImage = document.createElement('img');
  frontCardImage.classList.add('card__img');
  frontCardImage.src = card.image;
  frontCard.appendChild(frontCardImage);
	
	const backCard = document.createElement('div');
	backCard.classList.add('back-card', 'hidden');
	const backCardImage = document.createElement('img');
	backCardImage.src = '../assets/images/logo-adalab-80px.png';
	backCard.appendChild(backCardImage);
	
  const newCard = document.createElement('li');
	newCard.classList.add('card');
	newCard.dataset.pair = card.pair;
  newCard.appendChild(frontCard);
  newCard.appendChild(backCard);
	cardsContainer.appendChild(newCard);
};


const printCards = () => {
	for (const card of saveData) {
		createCard(card);
	}
};

const turnCard = (event) => {
	event.currentTarget.firstElementChild.classList.toggle('front-card');
	event.currentTarget.lastElementChild.classList.toggle('back-card');
};

const handleCardClick = (event) => {
	turnCard(event);
	changeDafaFace(event);
	compareCards(event);
};

const addEventOnCards = () => {
	cards = document.querySelectorAll('.card');
	for (const card of cards){
		card.addEventListener('click', handleCardClick);
	}
};

const getDataFromServer = () => {
  fetch(
    `https://raw.githubusercontent.com/Adalab/cards-data/master/${gameSize}.json`
  )
    .then(response => response.json())
    .then(data => (saveData = data))
		.then(() => printCards())
		.then(() => addEventOnCards());
};

const generateCards = () => {
  getDataFromServer();
};

const cleanCardsContainer = () => cardsContainer.innerHTML = '';

const startGame = () => {
	cleanCardsContainer();
  getGameSize();
  generateCards();
};

startBtn.addEventListener('click', startGame);

/// Implementation

let turnedCards = [];
const compareCards = () => {
	turnedCards = [];
	for (let i = 0; i < cards.length; i++){
		if (cards[i].dataset.face === 'front'){
			turnedCards.push(cards[i]);
			if (turnedCards.length === 2){
				console.log(turnedCards);
					if(turnedCards[0].dataset.pair === turnedCards[1].dataset.pair){
						console.log('match card');
						for (const card of turnedCards){
							card.classList.add('match-pair');
							card.dataset.face = 'blocked';
							card.removeEventListener('click', handleCardClick);
						}
					} else {
						console.log('dont mach');
					}
				turnedCards = [];
			}
		}
	}
};

const changeDafaFace = (event) => {
	if (event.currentTarget.dataset.face === 'front'){
		event.currentTarget.dataset.face = 'back';
		console.log("I'm face back");
	} else {
		event.currentTarget.dataset.face = 'front';
	}
};