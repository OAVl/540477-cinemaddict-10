import TopRatedComponent from './components/topRated';
import CommentedComponent from './components/commented';
import FilmsComponent from './components/films';
import FiltersComponent from './components/filter';
import StatisticComponent from './components/statistic';
import UserComponent from './components/user';
import StatisticFooterComponent from './components/statisticFooter';
import {genFilter} from './mock/menu.js';
import {generateCards} from './mock/card.js';
import {genStatistic} from './mock/statistic.js';
import {userRating} from './mock/user.js';
import {render} from './util.js';
import PageController from './controllers/page';

const siteFooterElement = document.querySelector(`.footer`);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

const TASK_COUNT = 22;

const cardsSort = generateCards(TASK_COUNT);

const topRatedCards = cardsSort.filter((card) => card.rating).sort((prev, next) => next.rating - prev.rating).slice(0, 2);
const mostCommentedCards = cardsSort.filter((card) => card.comments.length).sort((prev, next) => next.comments.length - prev.comments.length).slice(0, 2);

const user = userRating();
render(siteHeader, new UserComponent(user).getElement());
const filter = genFilter();
render(siteMain, new FiltersComponent(filter).getElement());

const filmsComponent = new FilmsComponent(topRatedCards.length, mostCommentedCards.length);
render(siteMain, filmsComponent.getElement());

const films = filmsComponent.getElement().querySelector(`.films-list`);
const filmsContainer = films.querySelector(`.films-list__container`);

render(siteMain, new TopRatedComponent().getElement());
render(siteMain, new CommentedComponent().getElement());

const pageController = new PageController(filmsContainer);
pageController.render(cardsSort);

const statistic = genStatistic();
render(siteMain, new StatisticComponent(statistic).getElement());
render(siteFooterElement, new StatisticFooterComponent().getElement());

