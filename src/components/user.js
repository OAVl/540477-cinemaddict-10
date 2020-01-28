import AbstractComponent from './abstract-component.js';
import Common from "../utils/common";
export const getAmountFilms = (films) => {
  return films.reduce((accumulator, item) => {
    return {
      watchlist: accumulator.watchlist + item.watchlist,
      alreadyWatched: accumulator.alreadyWatched + item.alreadyWatched,
      favorite: accumulator.favorite + item.favorite
    };
  }, {watchlist: 0, favorite: 0, alreadyWatched: 0});
};


const createProfileTemplate = (films) => {
  const historiesFilms = getAmountFilms(films).history;

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${Common.getUserRank(historiesFilms)}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class Profile extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createProfileTemplate(this._films);
  }
}
