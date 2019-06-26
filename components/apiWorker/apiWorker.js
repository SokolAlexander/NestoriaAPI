export class ApiWorker {
    constructor(app) {
        this.app = app;
        this.callbackRegistry = {};
        this.url = 
            'https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&';
    }

    makeRequestScript(url, _onSuccess, _onError) {
        let scriptOk = false;

        let callbackName = 'cb_' + (Date.now());
        url += '&callback=app.apiWorker.callbackRegistry.' + callbackName;

        this.callbackRegistry[callbackName] = (data) => {
            scriptOk = true;
            delete this.callbackRegistry[callbackName];
            document.head.removeChild(document.head.querySelector('script'));
            this.returnData(data);
        }

        let script = document.createElement('script');
        script.src = url;

        script.onload = script.onerror = () => {
            if (scriptOk) return;
            delete this.callbackRegistry[callbackName];
            document.head.removeChild(document.head.querySelector('script'));
            this.onError(url);
        }

        document.head.appendChild(script);
    }

    returnData(data) {
        app.takeData(data);
    }

    onError(url) {
        console.error('error with ' + url);
    }

    getNextPage(page) {
        let url = this.currentUrl + '&page=' + page;
        this.makeRequestScript(url, this.returnData, this.onError);
    }

    getListings(cityName) {
        this.currentUrl = this.url + 'place_name=' + cityName;
        this.makeRequestScript(this.currentUrl, this.returnData, this.onError);
    }
}