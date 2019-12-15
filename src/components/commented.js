import {createElement} from "../util.js";

const createCommentedTemplate = () => {
  return (
    `<section id="most-commented" class="films-list--extra">
       <h2 class="films-list__title">Most commented</h2>
       <div class="films-list__container"></div>
     </section>`
  );
};

export default class Commented {

  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCommentedTemplate();
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
