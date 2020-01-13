import AbstractComponent from "./abstract-component";

const createFilmExtraTemplate = (title, className) => {
  return (
    `<section class="films-list--extra ${className}">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section`
  );
};

export default class FilmsExtraSection extends AbstractComponent {
  constructor(title, className) {
    super();
    this._title = title;
    this._className = className;
  }
  getTemplate() {
    return createFilmExtraTemplate(this._title, this._className);
  }
}
