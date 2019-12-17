import {getRandomIntegerNumber} from "../mock/card";
import AbstractComponent from './abstract-component.js';

const createStatisticFooterTemplate = () => {
  const statisticFooter = getRandomIntegerNumber(1, 150000);

  return (
    `<section className="footer__statistics">
       <p>${statisticFooter} movies inside</p>
     </section>`
  );
};

export default class StatisticFooter extends AbstractComponent {
  getTemplate() {
    return createStatisticFooterTemplate();
  }
}
