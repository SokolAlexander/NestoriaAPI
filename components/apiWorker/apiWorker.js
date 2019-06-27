export class ApiWorker {
    constructor(app) {
        this.app = app;
        this.callbackRegistry = {};
        this.url = 
            'https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&';
        this.currentUrl = this.url;
    }

    makeRequestScript(url, _onSuccess, _onError) {
        let scriptOk = false;

        let callbackName = 'cb_' + (Date.now());
        url += '&callback=' + callbackName;

        this.callbackRegistry[callbackName] = (data) => {
            scriptOk = true;
            this._clear(callbackName);
            document.head.removeChild(document.head.querySelector('script'));
            _onSuccess.call(this, data);
        }
        window[callbackName] = this.callbackRegistry[callbackName].bind(this);

        let script = document.createElement('script');
        script.src = url;

        script.onload = script.onerror = () => {
            if (scriptOk) return;
            this._clear(callbackName);
            document.head.removeChild(document.head.querySelector('script'));
            this.onError(url);
        }

        document.head.append(script);
    }

    _clear(callbackName) {
        delete this.callbackRegistry[callbackName];
        delete window[callbackName];
    }

    _checkResponse(data) {
        let code = data.response.application_response_code;
        if (code[0] === '1') {
            this.currentUrl = this.url + '&place_name=' + data.request.location;
            this.app.takeData(data);
            return
        };
        this.app.showWarning(code);
    }

    onError(url) {
        console.error('error with ' + url);
    }

    getNextPage(page) {
        let url = this.currentUrl + '&page=' + page;
        this.makeRequestScript(url, this._checkResponse, this.onError);
    }

    getListings(cityName) {
        let url = this.url + 'place_name=' + cityName;
        this.makeRequestScript(url, this._checkResponse, this.onError);
    }
}