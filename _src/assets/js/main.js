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
  const newCard = document.createElement('li');
  newCard.classList.add('card');
  frontCard.appendChild(frontCardImage);
	
	const backCard = document.createElement('div');
	backCard.classList.add('back-card', 'hidden');
	const backCardImage = document.createElement('img');
	backCardImage.src = '../assets/images/logo-adalab-80px.png';
	backCard.appendChild(backCardImage);
	
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

