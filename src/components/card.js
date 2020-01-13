import AbstractComponent from './abstract-component.js';

export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }
  getTemplate() {
    const createCardTemplate = (card) => {
      const {name, duration, genre, rating, poster, description, year, comments, isWatchlist, isWatched, isFavorite} = card;

      return (
        `<article class="film-card">
          <h3 class="film-card__title">${name}</h3>
          <p class="film-card__rating">${rating}</p>
          <p class="film-card__info">
            <span class="film-card__year">${year}</span>
            <span class="film-card__duration">${duration}</span>
            <span class="film-card__genre">${genre}</span>
          </p>
          <img src=${poster} alt="" class="film-card__poster" tabindex="1">
          <p class="film-card__description">${description}</p>
          <a class="film-card__comments">${comments}</a>
          <form class="film-card__controls">
            <button class="${isWatchlist ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--add-to-watchlist">Add to watchlist</button>
                <button class="${isWatched ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--mark-as-watched">Mark as watched</button>
                <button class="${isFavorite ? `film-card__controls-item--active ` : ``} film-card__controls-item button film-card__controls-item--favorite">Mark as favorite</button>
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

  setButtonWatchlsitClickHanlder(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, handler);
  }
  setButtonWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, handler);
  }
  setButtonFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, handler);
  }
}
