class MainApi {
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
    _sendDataToServer(method, url, bodyObj, headers = {}) {
        return fetch(this._options.baseUrl + url, {
            method: method,
            headers: { ...this._options.headers, ...headers },
            body: JSON.stringify(bodyObj)
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject({ status: res.status, msg: res.statusText });
        })
    }

    _sendDataToServerNoJSON(method, url, bodyObj, headers = {}) {
        return fetch(this._options.baseUrl + url, {
            method: method,
            headers: { ...this._options.headers, ...headers },
            body: bodyObj
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject({ status: res.status, msg: res.statusText });
        })
    }

    //Авторизация пользователя
    authUser({ email, password }) {
        return this._sendDataToServer("POST", "/signin", {
            email, password
        })
            .then((data) => {
                return data;
            })
    }

    //Создать пользователя
    createUser({ name, email, password }) {
        return this._sendDataToServer("POST", "/signup", {
            name, email, password
        })
    }


    //Получить информацию пользователя
    getUserInfo() {
        return this._accessServer("GET", "/users/me")
    }

    //Изменить информацию пользователя
    patchUserInfo({ name, email }) {
        return this._sendDataToServer("PATCH", "/users/me", {
            name, email
        })
    }

    getPartners() {
        return this._accessServer("GET", "/partners")
    }

    getProducts(partnerID) {
        return this._accessServer("GET", `/${partnerID}/products`)
    }

    getCategories(partnerID) {
        return this._accessServer("GET", `/${partnerID}/categories`)
    }

    getProductByCategory(partnerID, categoryID) {
        return this._accessServer("GET", `/${partnerID}/products/${categoryID}`)
    }

    sendOrder(partnerID, order) {
        return this._sendDataToServer("POST", `/${partnerID}/order/`, { order })
    }


    tokenizatorSearch(partnerID, searchReq) {
        console.log(partnerID, searchReq)
        return this._sendDataToServer("POST", "/tokenize", { partnerID, searchReq })
    }


    audioSearch(partnerID, audioURL) {
        return fetch(audioURL)
            .then(response => response.blob())
            .then(file => {
                console.log(file)
                const formData = new FormData();
                formData.append('upl', file, 'myfiletosave.ogg');
                formData.append('partnerID', partnerID);
                return fetch(`${this._options.baseUrl}/audiotokenize`,
                    {
                        method: 'POST',
                        body: formData,
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('jwt')}`,
                            'enctype': 'multipart/form-data'
                        }
                    })
            })
            .then(res => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject({ status: res.status, msg: res.statusText });
            })
            .catch(err=>console.log(err))
    }
    //Проверка токена
    checkToken(token) {
        return this._accessServer("GET", "/users/me", {
            "Content-Type": "application/json",
            authorization: `Bearer ${token}`
        })
    }
    //Ресет токена пользователя
    resetToken() {
        this._options.headers.authorization = `Bearer ${localStorage.getItem('jwt')}`
    }

    setToken(token) {
        this._options.headers.authorization = `Bearer ${token}`
    }
}

export default new MainApi({
    baseUrl: 'http://localhost:3000',
    headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
    }
});;