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

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const getRandomSubarray = (items) => {
  items = items.slice();
  let count = getRandomInt(1, items.length - 1);
  const result = [];
  while (count--) {
    result.push(
      ...items.splice(
        getRandomInt(0, items.length - 1), 1
      )
    );
  }

  return result;
};

module.exports = {getRandomInt, shuffle, ensureArray, getRandomSubarray};
