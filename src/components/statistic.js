import {getRandomIntegerNumber, getRandomArrayItem} from '../mock/card.js';
import AbstractComponent from './abstract-component.js';

export default class Statistic extends AbstractComponent {

  constructor(statistic) {
    super();
    this._statistic = statistic;
  }

  getTemplate() {
    const number = getRandomIntegerNumber(1, 130);
    const numberHour = getRandomIntegerNumber(1, 200);
    const numberMinute = getRandomIntegerNumber(1, 60);
    const topRange = getRandomArrayItem([`Sci-Fi`, `Musical`, `Drama`, `Fantasy`, `Melodrama`, `Comedy`]);

    const createStatisticMarkup = (statistic, isChecked) => {
      const {name} = statistic;

      return (
        `<input type="radio" className="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-${name}" value="${name}" ${isChecked ? `checked` : ``}>
    <label htmlFor="statistic-${name}" className="statistic__filters-label">${name}</label>`
      );
    };

    const createStatisticTemplate = (statistics) => {
      const statisticMarkup = statistics.map((it, i) => createStatisticMarkup(it, i === 0)).join(`\n`);

      return (
        `<section className="statistic">
      <p className="statistic__rank">
        Your rank
        <img className="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span className="statistic__rank-label">Sci-Fighter</span>
      </p>
  
      <form action="https://echo.htmlacademy.ru/" method="get" className="statistic__filters">
        <p className="statistic__filters-description">Show stats: ${statisticMarkup}</p> 
      </form>
  
      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${number} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${numberHour} <span class="statistic__item-description">h</span> ${numberMinute} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topRange}</p>
        </li>
      </ul>
  
      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>
  
    </section>`
      );
    };

    return createStatisticTemplate(this._statistic);
  }
}
