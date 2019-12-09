import {createCardTemplate} from './components/card.js';
import {createPopupTemplate} from './components/popup';
import {createCommentTemplate} from './components/popup';
import {createTopRatedTemplate} from './components/topRated';
import {createCommentedTemplate} from './components/commented';
import {createFilmsTemplate} from './components/films';
import {createFilterTemplate} from './components/filter';
import {createStatisticTemplate} from './components/statistic';
import {createButtonTemplate} from './components/button';
import {createUserTemplate} from './components/user';
import {createStatisticFooterTemplate} from './components/statistic';
import {genFilter} from './mock/menu.js';
import {generatePopup} from './mock/popup.js';
import {generateComments} from './mock/popup.js';
import {generateCards} from './mock/card.js';
import {genStatistic} from './mock/statistic.js';
import {userRating} from './mock/user.js';

const TASK_COUNT = 5;
const TASK_COUNT_ADDITIONAL = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const user = userRating();
render(siteHeader, createUserTemplate(user), `beforeend`);
const filter = genFilter();
render(siteMain, createFilterTemplate(filter), `beforeend`);
render(siteMain, createFilmsTemplate(), `beforeend`);

const films = document.querySelector(`.films`);
const filmsContainer = films.querySelector(`.films-list__container`);

const allCards = generateCards(TASK_COUNT);
allCards.slice(0).forEach((card) => render(filmsContainer, createCardTemplate(card), `beforeend`));

render(filmsContainer, createButtonTemplate(), `beforeend`);

render(siteMain, createTopRatedTemplate(), `beforeend`);
render(siteMain, createCommentedTemplate(), `beforeend`);

const filmExtra = document.querySelectorAll(`.films-list--extra`);
const TopRatedContainer = filmExtra[0].querySelector(`.films-list__container`);

const cards = generateCards(TASK_COUNT_ADDITIONAL);
cards.slice(0).forEach((card) => render(TopRatedContainer, createCardTemplate(card), `beforeend`));

const commentContainer = filmExtra[1].querySelector(`.films-list__container`);
cards.slice(0).forEach((card) => render(commentContainer, createCardTemplate(card), `beforeend`));

const statistic = genStatistic();
render(siteMain, createStatisticTemplate(statistic), `beforeend`);

const footer = document.querySelector(`.footer`);
render(footer, createStatisticFooterTemplate(), `beforeend`);


const popup = generatePopup();
const commentPopup = generateComments(TASK_COUNT);
render(siteMain, createPopupTemplate(popup), `beforeend`);
const popupMain = siteMain.querySelector(`.form-details__bottom-container`);
commentPopup.slice(0).forEach((comment) => render(popupMain, createCommentTemplate(comment), `beforeend`));

const SHOWING_TASKS_COUNT_ON_START = 5;
const SHOWING_TASKS_COUNT_BY_BUTTON = 5;

let showingCardsCount = SHOWING_TASKS_COUNT_ON_START;


const loadMoreButton = filmsContainer.querySelector(`.films-list__show-more`);
loadMoreButton.addEventListener(`click`, () => {
  allCards.slice(0, showingCardsCount).forEach((card) => render(filmsContainer, createCardTemplate(card), `beforeend`));
  const prevTasksCount = showingCardsCount;
  showingCardsCount = showingCardsCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  allCards.slice(prevTasksCount, showingCardsCount)
    .forEach((card) => render(filmsContainer, createCardTemplate(card), `beforeend`));

  if (showingCardsCount >= allCards.length) {
    loadMoreButton.remove();
  }
});
