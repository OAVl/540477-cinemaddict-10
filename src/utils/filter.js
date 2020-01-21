const FilterType = {
  ALL: `All movies`,
  WATCHLIST: `Watchlist`,
  HISTORY: `History`,
  FAVORITES: `Favorites`,
};

const getAllFilms = (films) => {
  return films.filter((film) => film);
};

const getWatchlistFilms = (films) => {
  return films.filter((film) => film.isWatchlist);
};

const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

const getFavoritesFilms = (films) => {
  return films.filter((film) => film.isFavorite);
};

const getFilmsByFilter = (films, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return getAllFilms(films);
    case FilterType.WATCHLIST:
      return getWatchlistFilms(films);
    case FilterType.HISTORY:
      return getWatchedFilms(films);
    case FilterType.FAVORITES:
      return getFavoritesFilms(films);
  }
  return films;
};

export {getAllFilms, getFavoritesFilms, getFilmsByFilter, getWatchedFilms, getWatchlistFilms, FilterType};
