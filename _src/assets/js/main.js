/* eslint-disable indent */
"use strict";

const radioBtns = document.querySelectorAll("input[name=cards-number]");
const startBtn = document.querySelector("#start-btn");
const cardsContainer = document.querySelector(".cards__list");
let cards = [];
let gameSize = localStorage.getItem("game-size");
let saveData = [];

const getGameSizeFromLocal = () => {
  gameSize = localStorage.getItem("game-size");
  for (const radio of radioBtns) {
    if (radio.value === gameSize) {
      radio.checked = true;
    }
  }
  return gameSize;
};

const getGameSizeFromInput = () => {
  for (const radio of radioBtns) {
    if (radio.checked) {
      gameSize = parseInt(radio.value);
      localStorage.setItem("game-size", gameSize);
    }
  }
  return gameSize;
};

const createCard = card => {
  const frontCard = document.createElement("div");
  frontCard.classList.add("hidden");
  const frontCardImage = document.createElement("img");
  frontCardImage.classList.add("card__img");
  frontCardImage.src = card.image;
  frontCard.appendChild(frontCardImage);

  const backCard = document.createElement("div");
  backCard.classList.add("back-card", "hidden");
  const backCardImage = document.createElement("img");
  backCardImage.src =
    "https://via.placeholder.com/160x195/30d9c4/ffffff/?text=ADALAB";
  backCard.appendChild(backCardImage);

  const newCard = document.createElement("li");
  newCard.classList.add("card");
  newCard.dataset.pair = card.pair;
  newCard.appendChild(frontCard);
  newCard.appendChild(backCard);
  cardsContainer.appendChild(newCard);
};

///shufle
let shuffledCards = [];

const getShuffleCards = () => {
  shuffledCards = [];
  let shuffleList = [];
  for (let i = saveData.length; i > 0; i--){
    let shuffle = Math.floor(Math.random() * (saveData.length));
    if (!shuffleList.includes(shuffle)){
      shuffleList.push(shuffle);
      shuffledCards.push(saveData[shuffle]);
    } else {
      i ++;
    }
  }
  console.log(shuffleList);
  return shuffledCards;
};

const printCards = () => {
  getShuffleCards();
  for (const card of shuffledCards) {
    createCard(card);
  }
};

const turnCard = event => {
  event.currentTarget.firstElementChild.classList.toggle("front-card");
  event.currentTarget.lastElementChild.classList.toggle("back-card");
};

const addEventOnCards = () => {
  cards = document.querySelectorAll(".card");
  for (const card of cards) {
    card.addEventListener("click", handleCardClick);
  }
};

const handleCardClick = event => {
  turnCard(event);
  changeDafaFace(event);
  // blockCards();
  compareCards(event);
  getWinner();
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

const cleanCardsContainer = () => (cardsContainer.innerHTML = "");

const startGame = () => {
  if (gameSize) {
    getGameSizeFromLocal();
  } else {
    getGameSizeFromInput();
  }
  generateCards();
};

const handleStartBtnClick = () => {
  getGameSizeFromInput();
  cleanCardsContainer();
  generateCards();
};

startGame();

startBtn.addEventListener("click", handleStartBtnClick);

/// Implementation

const turnDontMatchingCards = card => {
  card.firstElementChild.classList.toggle("front-card");
  card.lastElementChild.classList.toggle("back-card");
  card.dataset.face = "back";
  for (const card of cards){
    card.addEventListener('click', handleCardClick);
  }
};

let flippedCards = [];

const compareCards = () => {
  flippedCards = [];
    for (let i = 0; i < cards.length; i++) {
      if (cards[i].dataset.face === "front") {
        flippedCards.push(cards[i]);
        if (flippedCards.length === 2) {
          for (const card of cards){
            card.removeEventListener('click', handleCardClick);
          }
          if (flippedCards[0].dataset.pair === flippedCards[1].dataset.pair) {
            for (const card of flippedCards) {
              card.classList.add("match-pair");
              card.dataset.face = "blocked";
              card.removeEventListener("click", handleCardClick);
              for (const card of cards){
                card.addEventListener('click', handleCardClick);
              }
            }
          } else {
            for (const card of flippedCards) {
              setTimeout(turnDontMatchingCards.bind(null, card), 1000);
            }
          }
          flippedCards = [];
        }
      }
    }
};


const changeDafaFace = event => {
  if (event.currentTarget.dataset.face === "front") {
    event.currentTarget.dataset.face = "back";
  } else {
    event.currentTarget.dataset.face = "front";
  }
};

// winner
const getWinner = () => {
  let points = 0;
  for (const card of cards) {
    if (card.dataset.face === "blocked") {
      points++;
      if (points === cards.length) {
        alert("Enhorabuena");
      }
    }
  }
};