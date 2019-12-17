import AbstractComponent from './abstract-component.js';

const createButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class Button extends AbstractComponent {

  getTemplate() {
    return createButtonTemplate();
  }

  setButtonHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
