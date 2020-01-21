import FilterComponent from '../components/filter.js';
import {render, replace, RenderPosition} from '../utils/util.js';
import {getFilmsByFilter, FilterType} from '../utils/filter.js';

const ACTIVE_CLASS = `main-navigation__item--active`;

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._statsButton = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
  }
  render() {
    const container = this._container;
    const allFilms = this._moviesModel.getAllFilms();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getFilmsByFilter(allFilms, filterType).length,
      };
    });
    const oldComponent = this._filterComponent;
    this._filterComponent = new FilterComponent(filters);
    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent.getElement(), RenderPosition.AFTERBEGIN);
    }
    this._statsButton = this._filterComponent.getElement().querySelector(`.main-navigation__item--additional`);
  }

  _onFilterChange() {
    this.render();
  }

  getFilterComponent() {
    return this._filterComponent;
  }

  changeFilterType(filterType) {
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }

  updateData() {
    this._onDataChange();
  }

  setFiltersHandler(handler) {
    this._filterComponent.getElement().querySelectorAll(`.main-navigation__item`).forEach((button) => {
      button.addEventListener(`click`, (evt) => {
        this.removeActiveClass();
        if (button === evt.target) {
          button.classList.add(ACTIVE_CLASS);
        } else {
          button.classList.remove(ACTIVE_CLASS);
        }
        const activeFilterValue = evt.target.textContent.slice(0, -2);
        this.changeFilterType(activeFilterValue);
        this._moviesModel.setFilter(activeFilterValue);
        handler();
      });
    });
  }

  switchToStatistics(pageControllerHandler, statsHandler) {
    this._statsButton.addEventListener(`click`, () => {
      this.removeActiveClass();
      this._statsButton.classList.toggle(ACTIVE_CLASS);
      pageControllerHandler();
      statsHandler();
    });
  }

  switchToFilms(pageControllerHandler, statsHandler) {
    const allMoviesButton = this._filterComponent.getElement().querySelector(`.main-navigation__item--all-movies`);
    allMoviesButton.addEventListener(`click`, () => {
      this._statsButton.classList.toggle(ACTIVE_CLASS);
      pageControllerHandler();
      statsHandler();
    });
  }

  removeActiveClass() {
    this._filterComponent.getElement().querySelectorAll(`.main-navigation__item`).forEach((button) => {
      button.classList.remove(ACTIVE_CLASS);
    });
  }
}
