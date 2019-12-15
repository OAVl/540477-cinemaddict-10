import {getRandomIntegerNumber} from "../mock/card";
import {createElement} from "../util";

const createStatisticFooterTemplate = () => {
  const statisticFooter = getRandomIntegerNumber(1, 150000);

  return (
    `<section className="footer__statistics">
       <p>${statisticFooter} movies inside</p>
     </section>`
  );
};

export default class StatisticFooter {

  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatisticFooterTemplate();
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
