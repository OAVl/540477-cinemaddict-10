import AbstractComponent from './abstract-component.js';

const createUserTemplate = (user) => {
  const {userRating} = user;

  return (
    `<section class="header__profile profile">
       <p class="profile__rating">${userRating}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
  );
};

export default class User extends AbstractComponent {

  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserTemplate(this._user);
  }
}
