import CardComponent from "../components/card.js";
import PopupComponent from "../components/popup.js";
import {remove, render, replace} from "../utils/util.js";
import moment from "moment";

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, filterController) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardComponent = null;
    this._popupComponent = null;

    this._mode = Mode.DEFAULT;
    this._filterController = filterController;
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
        document.removeEventListener(`keyup`, onCtrlEnterKeyup);
      }
    };

    const onButtonCloseClick = () => {
      remove(this._popupComponent);
      document.removeEventListener(`keyup`, onCtrlEnterKeyup);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onCtrlEnterKeyup = (evt) => {
      const isCombinationPressed = (evt.key === `Enter` && evt.ctrlKey);
      if (isCombinationPressed) {
        const emojiSrc = this._popupComponent.getElement().querySelector(`.film-details__emoji-item:checked`);
        const newComment = {
          id: String(new Date() + Math.random()),
          name: `You`,
          text: this._popupComponent.getElement().querySelector(`textarea`).value,
          date: moment().startOf().fromNow(),
          emoji: `./images/emoji/${emojiSrc.value}.png`,
        };
        if (newComment.text === `` || newComment.emoji === `./`) {
          return;
        }
        this._popupComponent.updateCommentsArray(newComment);
        this._popupComponent.renderComments();
        this._popupComponent.clearForm();
        this._popupComponent.rerenderCommentsBlockTitle();
      }
    };

    const onFilmInnerClick = () => {
      this._onViewChange();
      this._mode = Mode.DETAILS;
      render(siteMain, this._popupComponent.getElement());
      const buttonCloseDetails = this._popupComponent.getElement().querySelector(`.film-details__close-btn`);
      document.addEventListener(`keydown`, onEscKeyDown);
      document.addEventListener(`keyup`, onCtrlEnterKeyup);
      buttonCloseDetails.addEventListener(`click`, onButtonCloseClick);
      this._popupComponent._subscribeOnEvents();
      this._popupComponent.renderComments();
    };

    this._cardComponent.setFilmInnersClickHandlers(filmCardParts, onFilmInnerClick);

    this._cardComponent.setButtonWatchlistClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, card, Object.assign({}, card, {
        isWatchlist: !card.isWatchlist
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
      render(this._container, this._cardComponent.getElement());
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._popupComponent);
    }
  }
}
