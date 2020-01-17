import AbstractComponent from './abstract-component.js';

export default class Comment extends AbstractComponent {

  constructor(card) {
    super();
    this._comment = card;
  }

  getTemplate() {
    const createCommentTemplate = (card) => {
      const {id, text, nameComment, data, emoji} = card;
      return (
        `    <ul class="film-details__comments-list">
              <li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="${emoji}" width="55" height="55" alt="emoji">
                </span>
                <div>
                  <p class="film-details__comment-text">${text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${nameComment}</span>
                    <span class="film-details__comment-day">${data}</span>
                    <button data-index-number="${id}" class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>
            </ul>`
      );
    };

    return createCommentTemplate(this._comment);
  }
}
