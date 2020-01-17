import CardComponent from "../components/card.js";
import PopupComponent from "../components/popup.js";
import {remove, render, RenderPosition, replace} from "../utils/util.js";

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardComponent = null;
    this._popupComponent = null;

    this._mode = Mode.DEFAULT;
  }

  render(card) {

    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;

    this._cardComponent = new CardComponent(card);
    this._popupComponent = new PopupComponent(card);

    const siteMain = document.querySelector(`.main`);

    const filmCardParts = this._cardComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);

    const onEscKeyDown = (evt) => {
      const isEscape = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscape) {
        remove(this._popupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const onFilmInnerClick = () => {
      this._onViewChange();
      this._mode = Mode.DETAILS;
      render(siteMain, this._popupComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
      this._popupComponent._subscribeOnEvents();
    };

    this._cardComponent.setFilmInnersClickHandlers(filmCardParts, onFilmInnerClick);

    this._cardComponent.setButtonWatchlsitClickHanlder((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        toWatch: !card.toWatch
      }));
    });
    this._cardComponent.setButtonWatchedClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isWatched: !card.isWatched
      }));
    });
    this._cardComponent.setButtonFavoriteClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isFavorite: !card.isFavorite
      }));
    });


    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._cardComponent.getElement(), RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }
}
