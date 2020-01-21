import FilmsComponent from './components/films';
import StatisticComponent, {FilterTypeStatistic} from './components/statistic';
import UserComponent from './components/user';
import MoviesModel from './models/movies.js';
import {generateCards} from './mock/card.js';
import {render} from './utils/util.js';
import PageController from './controllers/page';
import SortComponent from './components/sort.js';
import FilterController from './controllers/filter.js';
import {RenderPosition} from "./utils/util";

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const CARD_COUNT = 22;
const cards = generateCards(CARD_COUNT);
const footerStatistic = document.querySelector(`.footer__statistics p`);
const statisticComponent = new StatisticComponent(cards, FilterTypeStatistic.ALL);
const sortComponent = new SortComponent();
const filmsComponent = new FilmsComponent();

render(siteHeader, new UserComponent().getElement());
render(siteMain, sortComponent.getElement(), RenderPosition.AFTERBEGIN);
render(siteMain, statisticComponent.getElement(), RenderPosition.AFTERBEGIN);
render(siteMain, filmsComponent.getElement());

const films = filmsComponent.getElement().querySelector(`.films-list`);
const filmsContainer = films.querySelector(`.films-list__container`);

const cardsModel = new MoviesModel();
cardsModel.setFilms(cards);

const filterComponent = new FilterController(siteMain, cardsModel);
filterComponent.render();
const pageController = new PageController(filmsContainer, sortComponent, cardsModel, filterComponent, statisticComponent);
pageController.render();

footerStatistic.textContent = `${cards.length} movies inside`;
