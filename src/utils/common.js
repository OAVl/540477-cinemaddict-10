const UserRank = {
  'NO_RANK': 0,
  'NOTICE': 10,
  'FAN': 20
};
import moment from "moment";

export default class Common {
  static getRandomElement(elements) {
    return elements[Math.floor(Math.random() * elements.length)];
  }

  static formatDate(date) {
    return moment(date).format(`YYYY/MM/DD hh:mm`);
  }

  static formatReleaseDate(date) {
    return moment(date).format(`DD MMMM YYYY`);
  }

  static getUserRank(count) {
    let rank;

    if (count === UserRank.NO_RANK) {
      rank = ``;
    } else if (count <= UserRank.NOTICE) {
      rank = `notice`;
    } else if (count <= UserRank.FAN) {
      rank = `fan`;
    } else {
      rank = `movie buff`;
    }

    return rank;
  }

  static isFilmsRating(films) {
    return films.some((film) => {
      return film.totalRating > 0;
    });
  }

  static isFilmsComments(films) {
    return films.some((film) => {
      return film.comments.length > 0;
    });
  }

  static compareComments(filmA, filmB) {
    return filmB.comments.length - filmA.comments.length;
  }

  static compareRating(filmA, filmB) {
    return filmB.totalRating - filmA.totalRating;
  }

  static compareDate(filmA, filmB) {
    return filmB.releaseDate - filmA.releaseDate;
  }

  static generateHours(minutes) {
    return Math.floor(minutes / 60 || 0);
  }

  static generateMinutes(minutes) {
    return minutes % 60;
  }

  static isEscKeyDown(evt) {
    return evt.key === `Escape` || evt.key === `Esc`;
  }

  static isActiveButtonClass(isFeature) {
    return isFeature ? `film-card__controls-item--active` : ``;
  }
}
