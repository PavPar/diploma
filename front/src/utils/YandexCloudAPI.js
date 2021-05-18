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
            body: bodyObj
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            return Promise.reject({ status: res.status, msg: res.statusText });
        })
    }

    postVoiceRecognition(audio){
        console.log(audio)
        return this._sendDataToServer("POST",``,audio)
    }
}

export default new MoviesApi({
    baseUrl: 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?folderId=b1gv3fl0m0isefc69r5m&lang=ru-RU',
    headers: {
        "Authorization": `Bearer t1.9euelZqMipuWnYzKj4mOiouKlsuXju3rnpWamMmdjZHPj5mTzYqSkZSLipXl8_d3VXB6-e8zE3w1_N3z9zcEbnr57zMTfDX8.lJCISLd3Tq3_UimldxcX4YkjjBrP_oV0qkuLu22wAIGrj-kNKkO6TJAGIN-oXFqCNH1YgbYMA839j-HINkahBg`}
});;