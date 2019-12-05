import {getRandomIntegerNumber} from '../mock/card.js';
import {getRandomArrayItem} from '../mock/card.js';
import {filmNames, description, genres, posters} from '../mock/card.js';
import {getRandomDescription, getFilmNames} from "../mock/card";

const director = [`Anthony Mann`, `Frank Darabont`, `Robert Zemeckis`];
const writers = [`Anne Wigton`, `Heinz Herald`, `Richard Weil`];
const actors = [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`];
const country = [`USA`, `Canada`, `Russia`, `UK`];
const nameComment = [`Tim Macoveev`, `John Doe`, `Alex Simpson`];
const textComment = [
  `Interesting setting and a good cast`,
  `Booooooooooring`,
  `Very very old. Meh`,
  `Almost two hours? Seriously?`
];

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generatePopup = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    name: getFilmNames(filmNames),
    duration: `${getRandomIntegerNumber(1, 2)}h ${getRandomIntegerNumber(0, 59)}m`,
    genre: getRandomArrayItem(genres),
    rating: getRandomIntegerNumber(1, 10),
    poster: getRandomArrayItem(posters),
    description: getRandomDescription(description),
    age: getRandomIntegerNumber(0, 18),
    director: getRandomArrayItem(director),
    writer: getRandomArrayItem(writers),
    actor: getRandomArrayItem(actors),
    dueDate,
    country: getRandomArrayItem(country),
    };
};

const generateComment = () => {
  return {
    text: getRandomArrayItem(textComment),
    nameComment: getRandomArrayItem(nameComment),
    data: getRandomDate(),
  }
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {generatePopup, generateComment, generateComments};
