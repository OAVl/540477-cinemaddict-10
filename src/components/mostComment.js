import AbstractComponent from './abstract-component.js';

export default class MostComment extends AbstractComponent {

  getTemplate() {
    const createCommentedTemplate = () => {
      return (
        `<section id="most-commented" class="films-list--extra">
       <h2 class="films-list__title">Most commented</h2>
       <div class="films-list__container"></div>
     </section>`
      );
    };

    return createCommentedTemplate();
  }
}
