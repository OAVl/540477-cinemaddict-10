import CardComponent from "../components/card.js";
import CommentComponent from "../components/comment.js";
import PopupComponent from "../components/popup.js";
import {remove, render, RenderPosition} from "../util.js";
import {generateCards} from "../mock/card.js";
import ButtonComponent from "../components/button.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;
let showingCardsCount = SHOWING_TASKS_COUNT_ON_START;
const cardsSort = generateCards(TASK_COUNT);

const topRatedCards = cardsSort.filter((card) => card.rating).sort((prev, next) => next.rating - prev.rating).slice(0, 2);
const mostCommentedCards = cardsSort.filter((card) => card.comments.length).sort((prev, next) => next.comments.length - prev.comments.length).slice(0, 2);

const renderCard = (filmListElement, card) => {
  const cardComponent = new CardComponent(card);
  const commentComponent = new CommentComponent(card);
  const popupComponent = new PopupComponent(card);
  const filmPosterElement = cardComponent.getElement().querySelector(`.film-card__poster`);
  const filmTitleElement = cardComponent.getElement().querySelector(`.film-card__title`);
  const filmCommentsQuantityElement = cardComponent.getElement().querySelector(`.film-card__comments`);
  const siteFooterElement = document.querySelector(`.footer`);

  const popupOpeners = [filmPosterElement, filmTitleElement, filmCommentsQuantityElement];

  const filmDetailsFormElement = popupComponent.getElement().querySelector(`.film-details__inner`);

  const onPopupOpenerClick = () => {
    render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTEREND);
    render(filmDetailsFormElement, commentComponent.getElement());
  };

  for (const popupOpener of popupOpeners) {
    popupOpener.addEventListener(`click`, onPopupOpenerClick);
  }

  popupComponent.popupButtonHandler(() => {
    popupComponent.getElement().remove();
  });

  render(filmListElement, cardComponent.getElement());
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._buttonComponent = new ButtonComponent();
  }

  render(cards) {
    const container = this._container;

    for (const card of cards.slice(0, showingCardsCount)) {
      renderCard(container, card);
    }

    render(container, this._buttonComponent);
    const topRatedFilmsListElement = document.querySelector(`#top-rated .films-list__container`);
    const mostCommentedFilmsListElement = document.querySelector(`#most-commented .films-list__container`);
    if (topRatedFilmsListElement) {
      for (const card of topRatedCards) {
        renderCard(topRatedFilmsListElement, card);
      }
    }

    if (mostCommentedFilmsListElement) {
      for (const card of mostCommentedCards) {
        renderCard(mostCommentedFilmsListElement, card);
      }
    }

    const onClickButtonComponent = () => {
      const prevCardsCount = showingCardsCount;
      showingCardsCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      for (const card of cards.slice(prevCardsCount, showingCardsCount)) {
        renderCard(container, card);
      }

      if (showingCardsCount >= cards.length) {
        remove(this._buttonComponent);
        document.removeEventListener(`click`, onClickButtonComponent);
      }
    };

    this._buttonComponent.setButtonHandler(onClickButtonComponent);
  }
}
