import CardComponent from "../components/card.js";
import PopupComponent from "../components/popup.js";
import {remove, render, replace} from "../utils/util.js";
import CardModel from '../models/card.js';
import moment from "moment";

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`,
};

const getRandomIntegerFromGap = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY HH:mm`);
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, filterController, onCommentsChange, onCommentDelete) {
    this._container = container;
    this._cardComponent = null;
    this._popupComponent = null;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentsChange = onCommentsChange;
    this._onCommentDelete = onCommentDelete;

    this._mode = Mode.DEFAULT;
    this._filterController = filterController;

    this._onEscKeyDown = this.onEscKeydown.bind(this);
    this._onCtrlEnterKeyup = this.onCtrlEnterKeyup.bind(this);
  }

  render(card) {

    const oldCardComponent = this._cardComponent;
    const oldPopupComponent = this._popupComponent;
    const siteMain = document.querySelector(`.main`);
    this._cardComponent = new CardComponent(card);
    this._popupComponent = new PopupComponent(card);
    const filmCardParts = this._cardComponent.getElement().querySelectorAll(`.film-card__poster, .film-card__title, .film-card__comments`);


    const onButtonCloseClick = () => {
      remove(this._popupComponent);
      document.removeEventListener(`keyup`, this._onCtrlEnterKeyup);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    };

    const onFilmInnerClick = () => {
      this._onViewChange();
      this._mode = Mode.DETAILS;
      this._popupComponent.getElement().classList.add(`bounce-in-right`);
      render(siteMain, this._popupComponent.getElement());
      this.setPutRatingClickHandler();
      const buttonCloseDetails = this._popupComponent.getElement().querySelector(`.film-details__close-btn`);
      buttonCloseDetails.addEventListener(`click`, onButtonCloseClick);
      this._popupComponent.renderComments();
      this._popupComponent.rerenderCommentsBlockTitle();
      this.setFilmDetailsButtonClick(card);
      this._popupComponent.showRatingBlock();
      this.setDeleteCommentClickHandler();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keyup`, this._onCtrlEnterKeyup);
      document.addEventListener(`keydown`, this._onEscKeyDown);
      document.addEventListener(`keyup`, this._onCtrlEnterKeyup);
    };

    this._cardComponent.setFilmInnersClickHandlers(filmCardParts, onFilmInnerClick);

    this._cardComponent.setButtonWatchlistClickHandler((evt) => {
      evt.preventDefault();

      const newCard = CardModel.clone(card);
      newCard.watchList = !newCard.watchList;
      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setButtonWatchedClickHandler((evt) => {
      evt.preventDefault();

      const newCard = CardModel.clone(card);
      newCard.alreadyWatched = !newCard.alreadyWatched;
      if (!newCard.alreadyWatched) {
        newCard.personalRating = 0;
      }
      newCard.watchingDate = newCard.watchingDate ? formatDate(new Date()) : null;
      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setButtonFavoriteClickHandler((evt) => {
      evt.preventDefault();

      const newCard = CardModel.clone(card);
      newCard.favorite = !newCard.favorite;
      this._onDataChange(this, card, newCard);
    });


    if (oldPopupComponent && oldCardComponent) {
      replace(this._cardComponent, oldCardComponent);
      replace(this._popupComponent, oldPopupComponent);
    } else {
      render(this._container, this._cardComponent.getElement());
    }
    this._popupComponent.renderComments();
    this._popupComponent.rerenderCommentsBlockTitle();
    this._popupComponent.setRatingValue();
    this.setDeleteCommentClickHandler();
    const buttonCloseDetails = this._popupComponent.getElement().querySelector(`.film-details__close-btn`);
    buttonCloseDetails.addEventListener(`click`, onButtonCloseClick);
    this._popupComponent.recoveryListeners();
    this.setFilmDetailsButtonClick(card);
    this._popupComponent.showRatingBlock();
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keyup`, this._onCtrlEnterKeyup);
      remove(this._popupComponent);
    }
  }

  setDeleteCommentClickHandler() {
    const onDeleteButtonClick = (evt) => {
      evt.preventDefault();
      const card = this._popupComponent.getCard();
      const indexNumber = evt.target.dataset.indexNumber;
      const newCard = CardModel.clone(card);
      newCard.commentsList = card.commentsList.filter((comment) => comment.id !== indexNumber);
      newCard.comments = card.comments.filter((commentId) => commentId !== indexNumber);
      this._onCommentDelete(newCard.id, newCard, indexNumber).then((response) => {
        response.commentsList = newCard.commentsList;
        this._popupComponent.updateCommentsArray(response.commentsList);
        this._popupComponent.rerenderCommentsBlockTitle();
        this._popupComponent.renderComments();
        this.setDeleteCommentClickHandler();
      });
      this._onDataChange(this, card, newCard);
    };

    this._popupComponent.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.removeEventListener(`click`, onDeleteButtonClick);
    });

    this._popupComponent.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => {
      button.addEventListener(`click`, onDeleteButtonClick);
    });
  }

  setCommentSendErrorHandler() {
    const newCommentBlock = this._popupComponent.getElement().querySelector(`.film-details__new-comment`);
    const newCommentTextarea = newCommentBlock.querySelector(`.film-details__comment-input`);
    newCommentTextarea.disabled = false;
    newCommentTextarea.style.border = `1px solid red`;
    newCommentBlock.classList.add(`shake`);
  }

  setPutRatingClickHandler() {
    const oldCard = this._popupComponent.getCard();
    const ratingButtons = this._popupComponent.getElement().querySelectorAll(`.film-details__user-rating-input`);
    const onResetButtonClick = () => {
      ratingButtons.forEach((button) => {
        button.checked = false;
      });
      const newCard = CardModel.clone(oldCard);
      newCard.personalRating = 0;
      this._onDataChange(this, oldCard, newCard);
    };

    const onRatingButtonClick = (evt) => {
      const onRatingSendError = () => {
        const ratingLabels = ratingBlock.querySelectorAll(`.film-details__user-rating-label`);
        ratingLabels[(+evt.target.value - 1)].style.background = `red`;
        ratingBlock.classList.add(`shake`);

      };
      const newCard = CardModel.clone(oldCard);
      newCard.personalRating = parseInt(evt.target.value, 10);
      ratingButtons.forEach((button) => {
        button.disabled = true;
      });
      this._onDataChange(this, oldCard, newCard, onRatingSendError);
    };

    const ratingBlock = this._popupComponent.getElement().querySelector(`.film-details__user-wrap`);
    const resetButton = this._popupComponent.getElement().querySelector(`.film-details__watched-reset`);

    ratingButtons.forEach((button) => {
      button.addEventListener(`click`, onRatingButtonClick);
    });
    resetButton.addEventListener(`click`, onResetButtonClick);
  }

  setFilmDetailsButtonClick(card) {
    this._popupComponent.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, () => {
      const newCard = CardModel.clone(card);
      newCard.watchList = !newCard.watchList;
      this._onDataChange(this, card, newCard);
    });
    this._popupComponent.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, () => {
      const newCard = CardModel.clone(card);
      newCard.alreadyWatched = !newCard.alreadyWatched;
      newCard.personalRating = 0;
      this._onDataChange(this, card, newCard);
    });
    this._popupComponent.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, () => {
      const newCard = CardModel.clone(card);
      newCard.favorite = !newCard.favorite;
      this._onDataChange(this, card, newCard);
    });
  }

  onEscKeydown(evt) {
    const isEscape = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscape) {
      remove(this._popupComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
      document.removeEventListener(`keyup`, this._onCtrlEnterKeyup);
    }
  }
  onCtrlEnterKeyup(evt) {
    const isCombinationPressed = (evt.key === `Enter` && evt.ctrlKey);
    if (isCombinationPressed) {
      const emojiSrc = this._popupComponent.getElement().querySelector(`.film-details__emoji-item:checked`);
      const newComment = {
        id: `${getRandomIntegerFromGap(2700, 2800)}`,
        author: `You`,
        comment: this._popupComponent.getElement().querySelector(`textarea`).value,
        date: new Date(),
        emotion: `${emojiSrc.value}`,
      };

      if (newComment.text === `` || newComment.emotion === `./`) {
        return;
      }
      const detailedCard = this._popupComponent.getCard();
      const newCard = CardModel.clone(detailedCard);
      const newCommentTextarea = this._popupComponent.getElement().querySelector(`.film-details__comment-input`);
      newCard.comments.push(newComment.id);
      newCard.commentsList = detailedCard.commentsList;
      newCard.commentsList.push(newComment);
      newCommentTextarea.disabled = true;
      this._onCommentsChange(newCard, newComment, this.setCommentSendErrorHandler.bind(this))
        .then((response) => {
          newCard.commentsList = response.comments;

        });
      this._onDataChange(this, detailedCard, newCard, this.setCommentSendErrorHandler.bind(this));
    }
    this._popupComponent.recoveryListeners();
  }
}
