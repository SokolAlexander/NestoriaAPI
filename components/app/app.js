import { Form } from '../form/form.js';
import { List } from '../list/list.js';
import { ApiWorker } from '../apiWorker/apiWorker.js';
/**
 * class representing an app for working with Nestoria API
 */
export class App {
  /**
     * create an app inside htmlEl
     * @param {htmlEl} htmlEl
     */
  constructor (htmlEl) {
    this.el = htmlEl;
    this.form = new Form(this.el.querySelector('.form'));
    this.list = new List(this.el.querySelector('.list'));
    this.apiWorker = new ApiWorker(this);

    this._initEvents();
  }

  /**
     * adds EventListeners for submitting form,
     * or requesting next page
     */
  _initEvents () {
    this.el.addEventListener('formSubmit', e => {
      this.apiWorker.getListings(e.detail);
    });
    this.el.addEventListener('requestData', (e) => {
      this.apiWorker.getNextPage(e.detail.page);
    });
  }

  /**
     * takes data from the ApiWorker and transmits it
     * to list for rendering
     * @param {Object} data
     */
  takeData (data) {
    console.log('response ok: ' + data.response.application_response_code);
    if (data.response.page === 1) {
      this.list.setData(data.response);
    } else {
      this.list.addData(data.response);
    }
  }

  /**
     * calls list method to display warning
     * when something goes rong woth the query
     * @param {number} code
     */
  showWarning (code) {
    let warnText = '';
    if (code[0] === '2') {
      warnText = 'Nothing was found. Misspelled somewhere?';
    } else if (code[0] === '5') {
      warnText = 'Something\'s wrong on the server-side';
    } else {
      warnText = 'Invalid request';
    };
    this.list.displayWarning(warnText);
  }
}
