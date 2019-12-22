import AbstractComponent from './abstract-component.js';

export default class TopRated extends AbstractComponent {
  getTemplate() {
    const createTopRatedTemplate = () => {
      return (
        `<section id="top-rated" class="films-list--extra">
       <h2 class="films-list__title">Top rated</h2>
       <div class="films-list__container"></div>
     </section>`
      );
    };

    return createTopRatedTemplate();
  }
}
