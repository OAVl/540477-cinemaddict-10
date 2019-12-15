import {createElement} from "../util.js";

const createFilterMarkup = (filter) => {
  const {name, count} = filter;

  return (
    `<a href="#${name}" class="main-navigation__item">${name}<span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item">All movies</a>
      ${filtersMarkup}
      <a href="#stats" class="main-navigation__item main-navigation__item--additional main-navigation__item--active">Stats</a>
     </nav>
  
     <ul class="sort">
       <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
       <li><a href="#" class="sort__button">Sort by date</a></li>
       <li><a href="#" class="sort__button">Sort by rating</a></li>
     </ul>`
  );
};

export default class Filters {

  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
