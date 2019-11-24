import {createCardTemplate} from './components/card.js';
import {createPopupTemplate} from './components/popup';
import {createTopRatedTemplate} from './components/topRated';
import {createCommentedTemplate} from './components/commented';
import {createFilmsTemplate} from './components/films';
import {createFilterTemplate} from './components/filter';
import {createStatisticTemplate} from './components/statistic';
import {createButtonTemplate} from './components/button';
import {createUserTemplate} from './components/user';

const TASK_COUNT = 5;
const TASK_COUNT_ADDITIONAL = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

render(siteHeader, createUserTemplate(), `beforeend`);
render(siteMain, createFilterTemplate(), `beforeend`);
render(siteMain, createFilmsTemplate(), `beforeend`);

const films = document.querySelector(`.films`);
const filmsContainer = films.querySelector(`.films-list__container`);
new Array(TASK_COUNT).fill(``).forEach(() => render(filmsContainer, createCardTemplate(), `beforeend`));

render(filmsContainer, createButtonTemplate(), `beforeend`);

render(siteMain, createTopRatedTemplate(), `beforeend`);
render(siteMain, createCommentedTemplate(), `beforeend`);
const filmExtra = document.querySelectorAll(`.films-list--extra`);
const TopRatedContainer = filmExtra[0].querySelector(`.films-list__container`);
new Array(TASK_COUNT_ADDITIONAL).fill(``).forEach(() => render(TopRatedContainer, createCardTemplate(), `beforeend`));

const commentContainer = filmExtra[1].querySelector(`.films-list__container`);
new Array(TASK_COUNT_ADDITIONAL).fill(``).forEach(() => render(commentContainer, createCardTemplate(), `beforeend`));

render(siteMain, createStatisticTemplate(), `beforeend`);
render(siteMain, createPopupTemplate(), `beforeend`);
