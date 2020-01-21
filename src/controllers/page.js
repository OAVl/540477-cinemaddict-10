import {remove, render, replace} from "../utils/util.js";
import ButtonComponent from "../components/button.js";
import {SortType} from '../components/sort.js';
import FilmsExtraSectionComponent from '../components/films-extra-section.js';
import FilmsNoDataComponent from '../components/films-no-data.js';
import MovieController from '../controllers/movie.js';
import StatisticComponent, {FilterTypeStatistic} from '../components/statistic';

const SHOWING_TASKS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;
let showingCardsCount = SHOWING_TASKS_COUNT_ON_START;
const CARD_COUNT = 22;
const EXTRA_SECTION_CARD_COUNT = 2;

const renderCards = (filmListElement, cards, onDataChange, onViewChange, filterController) => {
  return cards.map((card) => {
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange, filterController);
    movieController.render(card);
    return movieController;
  });
};

export default class PageController {
  constructor(container, sort, cardsModel, filterController, statistic) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._filterController = filterController;
    this._filterComponent = filterController.getFilterComponent();
    this._mainSection = document.querySelector(`main`);

    this._showedCardControllers = [];

    this._buttonComponent = new ButtonComponent();
    this._sortComponent = sort;
    this._extraSectionTop = new FilmsExtraSectionComponent(`Top Rated`, `films-list--extra-rated`);
    this._extraSectionComment = new FilmsExtraSectionComponent(`Most Commented`, `films-list--extra-commented`);
    this._filmsNoData = new FilmsNoDataComponent();
    this._statsComponent = statistic;
    this._statsComponent.setActiveFilter();

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);

    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cards = this._cardsModel.getFilms();
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
          this._onViewChange,
          this._filterController
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
      const topRatedFilms = sortByStat(cards, `rating`);
      const lowRatingFilms = topRatedFilms.filter((it) => (parseInt(it.rating, 10)) === 0);
      if (lowRatingFilms === cards.length) {
        remove(topRatedFilmsContainer);
        return;
      }

      renderCards(
          topRatedFilmsContainer,
          topRatedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
          this._onDataChange,
          this._onViewChange,
          this._filterController
      );
    };

    const renderMostCommentedFilms = () => {
      render(siteMain, this._extraSectionComment.getElement());
      const mostCommentedFilmsContainer = document.querySelector(`.films-list--extra-commented .films-list__container`);
      const mostCommentedFilms = sortByStat(cards, `comments`);
      const lowCommentsFilms = mostCommentedFilms.filter((it) => it.comments === 0);
      if (lowCommentsFilms === cards.length) {
        remove(mostCommentedFilmsContainer);
        return;
      }

      renderCards(
          mostCommentedFilmsContainer,
          mostCommentedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
          this._onDataChange,
          this._onViewChange,
          this._filterController
      );
    };

    renderTopRatedFilms();
    renderMostCommentedFilms();
    this._renderLoadMoreButton(cards);
    this.setFilterStatisticClickHandler();
    this.setFiltersHandler();
  }

  _onDataChange(movieController, oldData, newData) {
    const isSuccess = this._cardsModel.updateFilm(oldData.id, newData);
    if (isSuccess) {
      movieController.render(newData);
    }
    this._filterController.updateData();
    this.updateStatsComponent();
    this.setFiltersHandler();
    this.setFilterStatisticClickHandler();
  }

  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  updateStatsComponent(radioButtonValue = FilterTypeStatistic.ALL) {
    remove(this._statsComponent);
    this._statsComponent = new StatisticComponent(this._cardsModel.getAllFilms(), radioButtonValue);
    this._statsComponent.setFilterType(radioButtonValue);
    this._statsComponent.setActiveFilter();
    this.setFilterStatisticClickHandler();
    render(this._mainSection, this._statsComponent.getElement());
    this._statsComponent.show();
  }


  _onSortTypeChange(sortType) {
    const cards = this._cardsModel.getFilms();
    let sortedCards = [];
    const filmListContainer = this._container.getElement().querySelector(`.films .films-list__container`);
    switch (sortType) {
      case SortType.DATE_SORT:
        sortedCards = cards.slice().sort((a, b) => b.year - a.year);
        break;
      case SortType.RATING_SORT:
        sortedCards = cards.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedCards = cards.slice();
        break;
    }
    remove(this._buttonComponent);
    showingCardsCount = 5;
    filmListContainer.innerHTML = ``;
    this._renderLoadMoreButton(sortedCards);
    renderCards(
        filmListContainer,
        sortedCards.slice(0, showingCardsCount),
        this._onDataChange,
        this._onViewChange,
        this._filterController
    );
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
          this._onViewChange,
          this._filterController
      );
      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (showingCardsCount >= CARD_COUNT) {
        remove(this._buttonComponent);
        document.removeEventListener(`click`, onClickButtonComponent);
      }
    };

    this._buttonComponent.setButtonHandler(onClickButtonComponent);
  }


  _onFilterChange() {
    const filteredFilms = this._cardsModel.getFilms();
    showingCardsCount = 5;
    const container = this._container.getElement().querySelector(`.films .films-list__container`);
    container.innerHTML = ``;
    renderCards(container, filteredFilms.slice(0, showingCardsCount), this._onDataChange, this._onViewChange, this._filterController);
    this._renderLoadMoreButton(filteredFilms);
  }

  show() {
    this._sortComponent.getElement().classList.remove(`visually-hidden`);
    this._container.getElement().classList.remove(`visually-hidden`);
  }

  hide() {
    this._sortComponent.getElement().classList.add(`visually-hidden`);
    this._container.getElement().classList.add(`visually-hidden`);
  }

  setFiltersHandler() {
    this._filterController.setFiltersHandler(this._onFilterChange);
    this._filterController.switchToStatistics(this.hide, this._statsComponent.show);
    this._filterController.switchToFilms(this.show, this._statsComponent.hide);
  }

  setFilterStatisticClickHandler() {
    this._statsComponent.getElement().querySelectorAll(`.statistic__filters-input`).forEach((button) => {
      button.addEventListener(`click`, (evt) => {
        this.updateStatsComponent(evt.target.value);
      });
    });
  }
}
