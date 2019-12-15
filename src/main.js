import CardComponent from './components/card.js';
import PopupComponent from './components/popup';
import CommentComponent from './components/comment.js';
import TopRatedComponent from './components/topRated';
import CommentedComponent from './components/commented';
import FilmsComponent from './components/films';
import FiltersComponent from './components/filter';
import StatisticComponent from './components/statistic';
import ButtonComponent from './components/button';
import UserComponent from './components/user';
import StatisticFooterComponent from './components/statisticFooter';
import {genFilter} from './mock/menu.js';
import {generateCards} from './mock/card.js';
import {genStatistic} from './mock/statistic.js';
import {userRating} from './mock/user.js';
import {RenderPosition, render} from './util.js';

const siteFooterElement = document.querySelector(`.footer`);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

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

  const popupOpeners = [filmPosterElement, filmTitleElement, filmCommentsQuantityElement];

  const popupCloseButtonElement = popupComponent.getElement().querySelector(`.film-details__close-btn`);
  const filmDetailsFormElement = popupComponent.getElement().querySelector(`.film-details__inner`);

  const onPopupOpenerClick = () => {
    render(siteFooterElement, popupComponent.getElement(), RenderPosition.AFTEREND);
    render(filmDetailsFormElement, commentComponent.getElement());
  };

  for (const popupOpener of popupOpeners) {
    popupOpener.addEventListener(`click`, onPopupOpenerClick);
  }

  popupCloseButtonElement.addEventListener(`click`, () => {
    popupComponent.getElement().remove();
  });

  render(filmListElement, cardComponent.getElement());
};

const user = userRating();
render(siteHeader, new UserComponent(user).getElement());
const filter = genFilter();
render(siteMain, new FiltersComponent(filter).getElement());

const filmsComponent = new FilmsComponent(topRatedCards.length, mostCommentedCards.length);
render(siteMain, filmsComponent.getElement());

const films = filmsComponent.getElement().querySelector(`.films-list`);
const filmsContainer = films.querySelector(`.films-list__container`);


for (const card of cardsSort.slice(0, showingCardsCount)) {
  renderCard(filmsContainer, card);
}

const loadMoreButtonComponent = new ButtonComponent();
render(filmsContainer, loadMoreButtonComponent.getElement());

render(siteMain, new TopRatedComponent().getElement());
render(siteMain, new CommentedComponent().getElement());
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

const statistic = genStatistic();
render(siteMain, new StatisticComponent(statistic).getElement());

const footer = document.querySelector(`.footer`);
render(footer, new StatisticFooterComponent().getElement());

const onClickButtonComponent = () => {
  const prevCardsCount = showingCardsCount;
  showingCardsCount += SHOWING_TASKS_COUNT_BY_BUTTON;

  for (const card of cardsSort.slice(prevCardsCount, showingCardsCount)) {
    renderCard(filmsContainer, card);
  }

  if (showingCardsCount >= cardsSort.length) {
    loadMoreButtonComponent.getElement().remove();
    loadMoreButtonComponent.removeElement();
    document.removeEventListener(`click`, onClickButtonComponent);
  }
};

loadMoreButtonComponent.getElement().addEventListener(`click`, onClickButtonComponent);
