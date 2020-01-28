import {remove, render, replace} from "../utils/util.js";
import ButtonComponent from "../components/button.js";
import SortType from '../components/sort.js';
import FilmsExtraSectionComponent from '../components/films-extra-section.js';
import FilmsNoDataComponent from '../components/films-no-data.js';
import MovieController from '../controllers/movie.js';
import StatisticComponent, {FilterTypeStatistic} from '../components/statistic';
import UserComponent from '../components/user.js';

import moment from 'moment';

let showingCardsCount = 5;
const EXTRA_SECTION_CARD_COUNT = 2;

const renderCards = (filmListElement, cards, onDataChange, onViewChange, filterController, cardsModel, onCommentsChange, onCommentDelete) => {
  const comments = cardsModel.getComments();
  return cards.map((card) => {
    card.commentsList = comments[card[`id`]];
    const movieController = new MovieController(filmListElement, onDataChange, onViewChange, filterController, onCommentsChange, onCommentDelete);
    movieController.render(card);
    return movieController;
  });
};

export default class PageController {
  constructor(container, sort, cardsModel, filterController, statistic, api, userProfile) {
    this._api = api;
    this._container = container;
    this._mainSection = document.querySelector(`main`);
    this._siteHeader = document.querySelector(`.header`);
    this._cardsModel = cardsModel;
    this._filterController = filterController;
    this._filterComponent = filterController.getFilterComponent();
    this._showedCardControllers = [];
    this._buttonComponent = new ButtonComponent();
    this._sortComponent = sort;
    this._topRatedComponent = new FilmsExtraSectionComponent(`Top Rated`, `films-list--extra-rated`);
    this._mostCommentedComponent = new FilmsExtraSectionComponent(`Most Commented`, `films-list--extra-commented`);
    this._filmsNoData = new FilmsNoDataComponent();
    this._statsComponent = statistic;
    this._statsComponent.setActiveFilter();
    this._userProfileComponent = userProfile;
    this._onCommentsChange = this._onCommentsChange.bind(this);
    this._onCommentDelete = this._onCommentDelete.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  render() {
    const cards = this._cardsModel.getFilms();
    const comments = this._cardsModel.getComments();
    this.setCommentsForEachFilm(cards, comments);
    const filmListContainer = this._container.getElement().querySelector(`.films .films-list__container`);

    const checkDataAmount = () => {
      if (cards.length === 0) {
        replace(this._filmsNoData, this._container);
        return;
      }
      const newCards = renderCards(
          filmListContainer,
          cards.slice(0, showingCardsCount),
          this._onDataChange,
          this._onViewChange,
          this._filterController,
          this._cardsModel,
          this._onCommentsChange,
          this._onCommentDelete
      );
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
    };

    checkDataAmount();
    this.renderTopRatedFilms(cards);
    this.renderMostCommentedFilms(cards);
    this._renderLoadMoreButton(cards);
    this.setFilterStatisticClickHandler();
    this.setFiltersHandler();
  }

  _onDataChange(movieController, oldData, newData, errorHandler = this.throwDefaultError) {
    this._api.updateFilm(oldData.id, newData)
      .then((cardModel) => {
        newData.comments = cardModel.comments;
        const isSuccess = this._cardsModel.updateFilm(oldData.id, cardModel);
        this._api.getComments(newData.id).then((commentsList) => {
          newData.comments = cardModel.comments;
          newData.commentsList = commentsList;
          if (isSuccess) {
            remove(this._userProfileComponent);
            remove(this._mostCommentedComponent);
            remove(this._topRatedComponent);
            this._userProfileComponent = new UserComponent(this._cardsModel.getAllFilms());
            this._topRatedComponent = new FilmsExtraSectionComponent(`Top Rated`, `films-list--extra-rated`);
            this._mostCommentedComponent = new FilmsExtraSectionComponent(`Most Commented`, `films-list--extra-commented`);
            render(this._siteHeader, this._userProfileComponent.getElement());
            this.renderTopRatedFilms(this._cardsModel.getFilms());
            this.renderMostCommentedFilms(this._cardsModel.getFilms());
            movieController.render(newData);
            movieController.setPutRatingClickHandler();
          }
        });
        remove(this._buttonComponent);
        this._renderLoadMoreButton(this._cardsModel.getFilms());
        this._filterController.updateData();
        this.updateStatsComponent();
        this.setFiltersHandler();
        this.setFilterStatisticClickHandler();

      }).catch(() => {
        errorHandler();
      });
  }


  _onViewChange() {
    this._showedCardControllers.forEach((it) => it.setDefaultView());
  }

  _onCommentsChange(newData, newComment, handler) {
    return this._api.createComment(newData.id, newComment).catch(() => {
      handler();
    });
  }

  _onCommentDelete(filmId, newData, commentId) {
    this._api.deleteComment(commentId);
    return this._api.updateFilm(filmId, newData);
  }

  updateStatsComponent(radioButtonValue = FilterTypeStatistic.ALL) {
    remove(this._statsComponent);
    this._statsComponent = new StatisticComponent(this._cardsModel.getAllFilms(), radioButtonValue);
    this._statsComponent.setFilterType(radioButtonValue);
    this._statsComponent.setActiveFilter();
    this.setFilterStatisticClickHandler();
    render(this._mainSection, this._statsComponent.getElement());
  }

  _onSortTypeChange(sortType) {
    const cards = this._cardsModel.getFilms();
    let sortedCards = [];
    const filmListContainer = this._container.getElement().querySelector(`.films .films-list__container`);
    switch (sortType) {
      case SortType.DATE_SORT:
        sortedCards = cards.slice().sort((a, b) => moment(b.date).unix() - moment(a.date).unix());
        break;
      case SortType.RATING_SORT:
        sortedCards = cards.slice().sort((a, b) => b.totalRating - a.totalRating);
        break;
      case SortType.DEFAULT:
        sortedCards = cards.slice();
        break;
    }
    remove(this._buttonComponent);
    showingCardsCount = 5;
    filmListContainer.innerHTML = ``;
    this._renderLoadMoreButton(sortedCards);
    const sortedFilms = renderCards(
        filmListContainer,
        sortedCards.slice(0, showingCardsCount),
        this._onDataChange,
        this._onViewChange,
        this._filterController,
        this._cardsModel,
        this._onCommentsChange,
        this._onCommentDelete
    );
    this._showedCardControllers = this._showedCardControllers.concat(sortedFilms);
  }

  _renderLoadMoreButton(array) {
    if (showingCardsCount >= array.length) {
      return;
    }
    render(
        this._container.getElement().querySelector(`.films .films-list`),
        this._buttonComponent.getElement());

    const onShowMoreFilmsButtonClick = () => {
      const filmListContainer = this._container.getElement().querySelector(`.films .films-list__container`);
      const INITIAL_NUMBER_OF_FILMS = 5;
      let totalAmountOfCards = array.length;
      let filmsToShow = totalAmountOfCards - showingCardsCount;
      showingCardsCount += filmsToShow > INITIAL_NUMBER_OF_FILMS ? INITIAL_NUMBER_OF_FILMS : filmsToShow;
      filmListContainer.innerHTML = ``;
      const newCards = renderCards(
          filmListContainer,
          array.slice(0, showingCardsCount),
          this._onDataChange,
          this._onViewChange,
          this._filterController,
          this._cardsModel,
          this._onCommentsChange,
          this._onCommentDelete
      );
      this._showedCardControllers = this._showedCardControllers.concat(newCards);
      if (showingCardsCount === totalAmountOfCards) {
        remove(this._buttonComponent);
      }
    };

    this._buttonComponent.setButtonHandler(onShowMoreFilmsButtonClick);
  }

  _onFilterChange() {
    const cards = this._cardsModel.getFilms();
    showingCardsCount = 5;
    const container = this._container.getElement().querySelector(`.films .films-list__container`);
    container.innerHTML = ``;
    const filteredCard = renderCards(
        container,
        cards.slice(0, showingCardsCount),
        this._onDataChange,
        this._onViewChange,
        this._filterController,
        this._cardsModel,
        this._onCommentsChange,
        this._onCommentDelete
    );
    this._showedCardControllers = this._showedCardControllers.concat(filteredCard);
    remove(this._buttonComponent);
    this._renderLoadMoreButton(cards);
    this._filterController.switchToFilms(this.show, this._statsComponent.hide);
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
        this._statsComponent.show();
      });
    });
  }

  setCommentsForEachFilm(films, commentsArray) {
    films.forEach((film) => {
      const filmId = film[`id`];
      film.commentsList = commentsArray[filmId];
    });
  }

  renderTopRatedFilms(movies) {

    render(
        this._container.getElement(),
        this._topRatedComponent.getElement()
    );
    const topRatedFilmsContainer = document.querySelector(`.films-list--extra-rated .films-list__container`);
    const topRatedFilms = this.sortByStat(movies, `totalRating`);
    const lowRatingFilms = topRatedFilms.filter((it) => parseInt(it.totalRating, 10) === 0);
    if (lowRatingFilms === movies.length) {
      remove(topRatedFilmsContainer);
      return;
    }
    const topRatedCards = renderCards(
        topRatedFilmsContainer,
        topRatedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
        this._onDataChange,
        this._onViewChange,
        this._filterController,
        this._cardsModel,
        this._onCommentsChange,
        this._onCommentDelete
    );
    this._showedCardControllers = this._showedCardControllers.concat(topRatedCards);
  }

  renderMostCommentedFilms(movies) {
    render(
        this._container.getElement(),
        this._mostCommentedComponent.getElement()
    );
    const mostCommentedFilmsContainer = document.querySelector(`.films-list--extra-commented .films-list__container`);
    const mostCommentedFilms = this.sortByStat(movies, `comments`);
    const lowCommentsFilms = mostCommentedFilms.filter((it) => it.comments.length === 0);
    if (lowCommentsFilms === movies.length) {
      remove(mostCommentedFilmsContainer);
      return;
    }
    const mosCommentedCards = renderCards(
        mostCommentedFilmsContainer,
        mostCommentedFilms.slice(0, EXTRA_SECTION_CARD_COUNT),
        this._onDataChange,
        this._onViewChange,
        this._filterController,
        this._cardsModel,
        this._onCommentsChange,
        this._onCommentDelete
    );
    this._showedCardControllers = this._showedCardControllers.concat(mosCommentedCards);
  }

  sortByStat(films, prop) {
    const copiedCards = films;
    if (prop === `comments`) {
      return copiedCards.sort((a, b) => b[prop].length - a[prop].length);
    }
    return copiedCards.sort((a, b) => b[prop] - a[prop]);
  }

  throwDefaultError() {
    throw new Error(`Something goes wrong...`);
  }
}
