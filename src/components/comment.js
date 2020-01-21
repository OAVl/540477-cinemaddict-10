import AbstractComponent from './abstract-component.js';
import {formatDate} from "../utils/moment";

const createCommentTemplate = (comment) => {
  const {id, text, nameComment, data, emoji} = comment;
  return (
    `    
              <li class="film-details__comment">
                <span class="film-details__comment-emoji">
                  <img src="./images/emoji/${emoji}" width="55" height="55" alt="emoji">
                </span>
                <div>
                  <p class="film-details__comment-text">${text}</p>
                  <p class="film-details__comment-info">
                    <span class="film-details__comment-author">${nameComment}</span>
                    <span class="film-details__comment-day">${formatDate(data)}</span>
                    <button data-index-number="${id}" class="film-details__comment-delete">Delete</button>
                  </p>
                </div>
              </li>
            `
  );
};


export default class Comment extends AbstractComponent {

  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }
}
