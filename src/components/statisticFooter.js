import {getRandomIntegerNumber} from "../mock/card";
import AbstractComponent from './abstract-component.js';

export default class StatisticFooter extends AbstractComponent {
  getTemplate() {
    const createStatisticFooterTemplate = () => {
      const statisticFooter = getRandomIntegerNumber(1, 150000);

      return (
        `<section className="footer__statistics">
          <p>${statisticFooter} movies inside</p>
         </section>`
      );
    };

    return createStatisticFooterTemplate();
  }
}
