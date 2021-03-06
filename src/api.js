import Card from './models/card.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const STATUS = {
  IS_SUCCESS: `200`,
  NOT_SUCCESS: `300`
};

const checkStatus = (response) => {
  if (response.status >= STATUS.IS_SUCCESS && response.status < STATUS.NOT_SUCCESS) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};


const API = class {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._autorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(Card.parseCards);
  }
  getComments(commentId) {
    return this._load({url: `comments/${commentId}`})
      .then((response) => response.json());
  }
  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Card.parseCard);
  }

  createComment(filmId, comment) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json());
  }

  deleteComment(commentId) {
    return this._load({url: `comments/${commentId}`, method: Method.DELETE});
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._autorization);
    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default API;
