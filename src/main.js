import API from './api.js';
import FilmsComponent from './components/films.js';
import StatisticComponent from './components/statistic.js';
import UserComponent from './components/user.js';
import MoviesModel from './models/movies.js';
import {render} from './utils/util.js';
import PageController from './controllers/page.js';
import SortComponent from './components/sort.js';
import FilterController from './controllers/filter.js';
import {RenderPosition} from "./utils/util.js";
import {FilterTypeStatistic} from './const.js';

const AUTHORIZATION = `Basic eo0w590ik29889q`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(END_POINT, AUTHORIZATION);

const cardsModel = new MoviesModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics p`);

const sortComponent = new SortComponent();
const filmsComponent = new FilmsComponent();

render(siteMain, filmsComponent.getElement());
render(siteMain, sortComponent.getElement(), RenderPosition.AFTERBEGIN);

const filterComponent = new FilterController(siteMain, cardsModel);

api.getFilms()
  .then((films) => {
    cardsModel.setFilms(films);
    filterComponent.render();
    const statisticComponent = new StatisticComponent(cardsModel.getFilms(), FilterTypeStatistic.ALL);
    render(siteHeader, new UserComponent(cardsModel.getAllFilms()).getElement());
    const pageController = new PageController(filmsComponent, sortComponent, cardsModel, filterComponent, statisticComponent, api, new UserComponent(cardsModel.getAllFilms()));
    render(siteMain, statisticComponent.getElement());
    const promises = films.map((film) => api.getComments(film[`id`]).then((comments) => comments));
    Promise.all(promises).then((comments) => {
      cardsModel.setComments(comments);
      pageController.render();
      footerStatistic.textContent = `${cardsModel.getAllFilms().length} movies inside`;
    });
  });


