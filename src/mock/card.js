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



const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);

  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(max * Math.random());
};

const getFilmNames = (array) => {
  const firstNames = getRandomArrayItem(array);
  const secondNames = getRandomArrayItem(array);

  return `${firstNames} ${secondNames}`;
};

const getRandomDescription = (array) => {
  return getRandomArrayItem(array);
};

const generateCard = () => {
  return {
    name: getFilmNames(filmNames),
    duration: `${getRandomIntegerNumber(1, 2)}h ${getRandomIntegerNumber(0, 59)}m`,
    genre: getRandomArrayItem(genres),
    rating: getRandomIntegerNumber(1, 10),
    poster: getRandomArrayItem(posters),
    description: getRandomDescription(description),
    year: getRandomIntegerNumber(1980, 2019),
    comments: `${getRandomIntegerNumber(1, 5)} comments`,
  };
};

const generateCards = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateCard);
};

export {getRandomIntegerNumber, generateCard, generateCards, getRandomDescription, getRandomArrayItem, filmNames, description, genres, posters, getFilmNames};
