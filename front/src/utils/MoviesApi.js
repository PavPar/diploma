class MoviesApi {
    constructor(options) {
        this._options = options;
    }

    //Произвести обращение к серверу без тела запроса
    _accessServer(method, url) {
        return fetch(this._options.baseUrl + url, {
            headers: this._options.headers,
            method: method
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(res.status);
            })
            .then((result) => {
                return result;
            })
    }

    //Отправка данных на сервер с телом запроса
    _sendDataToServer(method, url, bodyObj) {
        return fetch(this._options.baseUrl + url, {
            method: method,
            headers: this._options.headers,
            body: JSON.stringify(bodyObj)
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject({ status: res.status, msg: res.statusText });
        })
    }

    //Получить все фильмы
    getMovies(){
       return this._accessServer("GET", "/beatfilm-movies/")
    }

    getSyncBaseUrl(){
        return this._options.baseUrl;
    }
}

export default new MoviesApi({
    baseUrl: 'https://api.nomoreparties.co',
    headers: {
        'Content-Type': 'application/json'
    }
});;