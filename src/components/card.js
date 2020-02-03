import AbstractComponent from './abstract-component.js';
import moment from "moment";
import {convertRuntime} from '../const.js';

const convertReleaseDate = (date) => {
  return moment(date).format(`MM/DD/YYYY`);
};

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }
  getTemplate() {
    const createCardTemplate = (card) => {
      const {title, description, poster, genre, runtime, date, totalRating, comments, watchList, alreadyWatched, favorite} = card;

      const releaseDate = convertReleaseDate(date);
      const convertedRuntime = convertRuntime(runtime);

      return (
        `<article class="film-card">
          <h3 class="film-card__title">${title}</h3>
          <p class="film-card__rating">${totalRating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${releaseDate}</span>
            <span class="film-card__duration">${convertedRuntime}</span>
            <span class="film-card__genre">${genre.slice(0, 2)}</span>
          </p>
          <img src=${poster} alt="" class="film-card__poster" tabindex="1">
          <p class="film-card__description">${description.slice(0, 39)}</p>
          <a class="film-card__comments">${comments.length} comments</a>
          <form class="film-card__controls">
            <button class="${watchList ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
                <button class="${alreadyWatched ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
                <button class="${favorite ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
                  </form>
                </article>`
      );
    };

    return createCardTemplate(this._card);
  }

  setFilmInnersClickHandlers(array, handler) {
    for (let item of array) {
      item.addEventListener(`click`, handler);
    }
  }

  setButtonWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }
  setButtonWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }
  setButtonFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
