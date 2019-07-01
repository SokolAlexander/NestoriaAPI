/**
 * class for working with the Nestoria API
 */
export class ApiWorker {
  /**
     * creates a worker, saves link to the app
     * @param {App} app
     */
  constructor (app) {
    this.app = app;
    this.callbackRegistry = {};
    this.isOk = true;
    this.url =
            'https://api.nestoria.co.uk/api?encoding=json&pretty=1&action=search_listings&country=uk&listing_type=rent&';
    this.currentUrl = this.url;
  }

  /**
     * creates a script for  requesting data
     * saves callback in global (window)
     * @param {string} url
     * @param {function} onSuccess
     * @param {function} onError
     */
  makeRequestScript (url, onSuccess, onError) {
    let scriptOk = false;

    let callbackName = 'cb_' + (Date.now());
    url += '&callback=' + callbackName;

    this.callbackRegistry[callbackName] = (data) => {
      scriptOk = true;
      this._clear(callbackName);
      
      onSuccess.call(this, data);
    };
    window[callbackName] = this.callbackRegistry[callbackName].bind(this);

    let script = document.createElement('script');
    script.src = url;
    script.async = true;

    script.onload = script.onerror = () => {
      if (scriptOk) return;
      this._clear(callbackName);
      onError.call(this, url);
    };
    if (this.isOk) {
      this.isOk = false;
      document.head.append(script);
    } else setTimeout(() => document.head.append(script), 1000);
  }

  /**
     * cleans after script finished it's work
     * @param {string} callbackName
     */
  _clear (callbackName) {
    setTimeout(() => { this.isOk = true; }, 1000);
    document.head.removeChild(document.head.querySelector('script'));
    delete this.callbackRegistry[callbackName];
    delete window[callbackName];
  }

  /**
     * checks if query was ok
     * saves queryUrl for pagination
     * calls app to take data or show warning
     * @param {Object} data
     */
  _checkResponse (data) {
    let code = data.response.application_response_code;
    if (code[0] === '1') {
      this.currentUrl = this.url + '&place_name=' + data.request.location;
      this.app.takeData(data);
      return;
    };
    this.app.showWarning(code);
  }

  /**
     * gets called when the response callback couldn't work
     * for some reason
     * @param {string} url
     */
  onError (url) {
    console.error('error with ' + url);
  }

  /**
     * gets next page
     * @param {number} page
     */
  getNextPage (page) {
    let url = this.currentUrl + '&page=' + page;
    this.makeRequestScript(url, this._checkResponse, this.onError);
  }

  /**
     * gets url for query and calls makeRequestScript
     * @param {string} cityName
     */
  getListings (cityName) {
    let url = this.url + 'place_name=' + cityName;
    this.makeRequestScript(url, this._checkResponse, this.onError);
  }
}
