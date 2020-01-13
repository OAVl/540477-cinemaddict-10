import {remove, render, replace} from "../util.js";
import ButtonComponent from "../components/button.js";
import {SortType} from '../components/sort.js';
import FilmsExtraSectionComponent from '../components/films-extra-section.js';
import FilmsNoDataComponent from '../components/films-no-data.js';
import MovieController from '../controllers/movie.js';

const SHOWING_TASKS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;
let showingCardsCount = SHOWING_TASKS_COUNT_ON_START;
const CARD_COUNT = 22;
const EXTRA_SECTION_CARD_COUNT = 2;

const renderCards = (filmListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange);
    movieController.render(card);
    return movieController;
  });
};

export default class PageController {
  constructor(container, sort) {
    this._container = container;

    this._cards = [];
    this._showedCardControllers = [];

    this._buttonComponent = new ButtonComponent();
    this._sortComponent = sort;
    this._extraSectionTop = new FilmsExtraSectionComponent(`Top Rated`, `films-list--extra-rated`);
    this._extraSectionComment = new FilmsExtraSectionComponent(`Most Commented`, `films-list--extra-commented`);
    this._filmsNoData = new FilmsNoDataComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;
    const container = this._container;

    const checkNoDataFilms = () => {
      if (cards.length === 0) {
        replace(this._filmsNoData, container);
        return;
      }
      const newCards = renderCards(
          container,
          cards.slice(0, showingCardsCount),
          this._onDataChange,
          this._onViewChange
      );
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    };

    checkNoDataFilms();

    const sortByStat = (films, prop) => {
      const [...copiedCards] = films;
      return copiedCards.sort((a, b) => b[prop] - a[prop]);
    };

    const siteMain = document.querySelector(`.main`);

    const renderTopRatedFilms = () => {
      render(siteMain, this._extraSectionTop.getElement());
      const topRatedFilmsContainer = document.querySelector(`.films-list--extra-rated .films-list__container`);
      const topRatedFilms = sortByStat(this._cards, `rating`);
      const lowRatingFilms = topRatedFilms.filter((it) => (parseInt(it.rating, 10)) === 0);
      if (lowRatingFilms === this._cards.length) {
        remove(topRatedFilmsContainer);
        return;
      }

      renderCards(
          topRatedFilmsContainer,
          topRatedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
          this._onDataChange,
          this._onViewChange
      );
    };

    const renderMostCommentedFilms = () => {
      render(siteMain, this._extraSectionComment.getElement());
      const mostCommentedFilmsContainer = document.querySelector(`.films-list--extra-commented .films-list__container`);
      const mostCommentedFilms = sortByStat(this._cards, `comments`);
      const lowCommentsFilms = mostCommentedFilms.filter((it) => it.comments === 0);
      if (lowCommentsFilms === this._cards.length) {
        remove(mostCommentedFilmsContainer);
        return;
      }

      renderCards(
          mostCommentedFilmsContainer,
          mostCommentedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
          this._onDataChange,
          this._onViewChange
      );
    };

    renderTopRatedFilms();
    renderMostCommentedFilms();
    this._renderLoadMoreButton(this._cards);
  }

  _onDataChange(movieController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);
    if (index === -1) {
      return;
    }
    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    movieController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const filmListContainer = this._container.getElement().querySelector(`.films .films-list__container`);
    switch (sortType) {
      case SortType.DATE_SORT:
        sortedCards = this._cards.slice().sort((a, b) => b.year - a.year);
        break;
      case SortType.RATING_SORT:
        sortedCards = this._cards.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedCards = this._cards.slice();
        break;
    }
    remove(this._buttonComponent);
    showingCardsCount = 5;
    filmListContainer.innerHTML = ``;
    this._renderLoadMoreButton(sortedCards);
    renderCards(filmListContainer, sortedCards.slice(0, showingCardsCount));
  }

  _renderLoadMoreButton(array) {
    if (showingCardsCount >= array.length) {
      return;
    }

    render(document.querySelector(`.films-list`), this._buttonComponent.getElement());

    const onClickButtonComponent = () => {
      const prevCardsCount = showingCardsCount;
      showingCardsCount += SHOWING_TASKS_COUNT_BY_BUTTON;

      const newCards = renderCards(
          this._container,
          array.slice(prevCardsCount, showingCardsCount),
          this._onDataChange,
          this._onViewChange
      );
      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (showingCardsCount >= CARD_COUNT) {
        remove(this._buttonComponent);
        document.removeEventListener(`click`, onClickButtonComponent);
      }
    };

    this._buttonComponent.setButtonHandler(onClickButtonComponent);
  }
}
