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
import SortComponent from './components/sort.js';

const siteFooterElement = document.querySelector(`.footer`);
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);

const CARD_COUNT = 22;

const cardsSort = generateCards(CARD_COUNT);

const user = userRating();
render(siteHeader, new UserComponent(user).getElement());
const filter = genFilter();
render(siteMain, new FiltersComponent(filter).getElement());
const sortComponent = new SortComponent();
render(siteMain, sortComponent.getElement());

const filmsComponent = new FilmsComponent();
render(siteMain, filmsComponent.getElement());

const films = filmsComponent.getElement().querySelector(`.films-list`);
const filmsContainer = films.querySelector(`.films-list__container`);

const pageController = new PageController(filmsContainer, sortComponent);
pageController.render(cardsSort);

const statistic = genStatistic();
render(siteMain, new StatisticComponent(statistic).getElement());
render(siteFooterElement, new StatisticFooterComponent().getElement());

