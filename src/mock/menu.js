import {getRandomIntegerNumber} from '../mock/card.js';

const filterName = [`Watchlist`, `History`, `Favorites`];

const genFilter = () => {
  return filterName.map((it) => {
    return {
      name: it,
      count: getRandomIntegerNumber(1, 15),
    };
  });
};

export {genFilter};
