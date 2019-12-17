import AbstractComponent from './abstract-component.js';

const createCommentedTemplate = () => {
  return (
    `<section id="most-commented" class="films-list--extra">
       <h2 class="films-list__title">Most commented</h2>
       <div class="films-list__container"></div>
     </section>`
  );
};

export default class Commented extends AbstractComponent {

  getTemplate() {
    return createCommentedTemplate();
  }
}
