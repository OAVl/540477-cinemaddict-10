import {formatDate} from "../utils/moment";

const filmNames = [`Frozen`, `Джокер`, `Однажды`, `в Голливуде`, `Капитан`, `Марвел`, `Форрест`, `Гамп`];

const genres = [`Musical`, `Drama`, `Fantasy`, `Melodrama`, `Comedy`];

const posters = [
  `/images/posters/made-for-each-other.png`,
  `/images/posters/popeye-meets-sinbad.png`,
  `/images/posters/sagebrush-trail.jpg`,
  `/images/posters/santa-claus-conquers-the-martians.jpg`,
  `/images/posters/the-dance-of-life.jpg`,
  `/images/posters/the-great-flamarion.jpg`,
  `/images/posters/the-man-with-the-golden-arm.jpg`,
];
const description = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

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
const MONTHS = [`January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const emojies = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`];
const year = getRandomIntegerNumber(1980, 2019);
const viewingDates = [`today`, `week`, `month`, `year`];

const getFilmNames = (array) => {
  const firstNames = getRandomArrayItem(array);
  const secondNames = getRandomArrayItem(array);

  return `${firstNames} ${secondNames}`;
};

const getRandomDescription = (array) => {
  return getRandomArrayItem(array);
};

const generateCard = () => {
  const hoursDuration = getRandomIntegerNumber(1, 3);
  const minutesDuration = Math.floor(59 * Math.random());

  return {
    id: String(new Date() + Math.random()),
    name: getFilmNames(filmNames),
    duration: `${getRandomIntegerNumber(1, 2)}h ${getRandomIntegerNumber(0, 59)}m`,
    genre: getRandomArrayItem(genres),
    rating: getRandomIntegerNumber(1, 10),
    poster: getRandomArrayItem(posters),
    hoursDuration,
    minutesDuration,
    description: getRandomDescription(description),
    year: getRandomIntegerNumber(1980, 2019),
    countComments: `${getRandomIntegerNumber(1, 5)} comments`,
    isWatchlist: Math.random() > 0.5,
    isWatched: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    age: getRandomIntegerNumber(0, 18),
    director: getRandomArrayItem(director),
    writer: getRandomArrayItem(writers),
    actor: getRandomArrayItem(actors),
    releaseData: formatDate(`${getRandomIntegerNumber(1, 28)}, ${getRandomArrayItem(MONTHS)}, ${year}`),
    comment: generateComments(4),
    country: getRandomArrayItem(country),
    viewingDate: getRandomArrayItem(viewingDates),
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

const getRandomDate = () => {
  const targetDate = new Date();
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomIntegerNumber(0, 7);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    nameComment: getRandomArrayItem(nameComment),
    text: getRandomArrayItem(textComment),
    data: getRandomDate(),
    emoji: `./images/emoji/${getRandomArrayItem(emojies)}`
  };
};

const generateComments = (count = 4) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

export {
  getRandomIntegerNumber,
  generateCard,
  generateCards,
  getRandomDescription,
  getRandomArrayItem,
  filmNames,
  description,
  genres,
  posters,
  getFilmNames};
