import AbstractComponent from './abstract-component.js';

const checkUserRank = (int) => {
  if (int >= 21) {
    return `Movie Buff`;
  } else if (int <= 20 && int >= 11) {
    return `Fan`;
  }
  return `Novice`;
};

export default class User extends AbstractComponent {

  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    const createUserTemplate = (user) => {

      return (
        `<section class="header__profile profile">
       <p class="profile__rating">${checkUserRank(parseInt(user, 10))}</p>
       <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
     </section>`
      );
    };

    return createUserTemplate(this._user);
  }
}
