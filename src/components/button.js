import AbstractComponent from './abstract-component.js';

export default class Button extends AbstractComponent {
  getTemplate() {
    const createButtonTemplate = () => {
      return (
        `<button class="films-list__show-more">Show more</button>`
      );
    };

    return createButtonTemplate();
  }

  setButtonHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
