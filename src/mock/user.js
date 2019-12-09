import {getRandomIntegerNumber} from '../mock/card.js';

const userRating = () => {
  return {
    userRating: getRandomIntegerNumber(1, 20),
  };
};

export {userRating};
