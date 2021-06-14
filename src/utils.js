'use strict';

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  const copyArray = [...someArray];
  for (let i = copyArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [copyArray[i], copyArray[randomPosition]] = [copyArray[randomPosition], copyArray[i]];
  }

  return someArray;
};

module.exports = {getRandomInt, shuffle};
