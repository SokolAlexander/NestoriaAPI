import { Form } from '../form/form.js';
import { PlacesList } from '../list/places.js';
import { BookmarksList } from '../list/bookmarks.js';
import { ApiWorker } from '../apiWorker/apiWorker.js';
import { AbstractControl } from '../abstract/abstract.js';

/**
 * class representing an app for working with Nestoria API
 */
export class App extends AbstractControl {
  /**
     * create an app inside htmlEl
     * @param {htmlEl} htmlEl
     */
  constructor (htmlEl) {
    super();
    this.el = htmlEl;
    this.form = new Form(this.el.querySelector('.form'));
    this.list = new PlacesList(this.el.querySelector('.list'));
    this.bookmarks = new BookmarksList(this.el.querySelector('.bookmarks'));
    this.apiWorker = new ApiWorker(this);

    this._createWarning();
    this._initEvents();
  }

  /**
     * adds EventListeners for submitting form,
     * or requesting next page
     */
  _initEvents () {
    this.el.addEventListener('formSubmit', e => {
      this._hideWarning();
      this.apiWorker.getListings(e.detail);
    });
    this.el.addEventListener('requestData', (e) => {
      this.apiWorker.getNextPage(e.detail.page);
    });
    this.el.addEventListener('bookmarkChange', (e) => {
      console.log(e.detail, this.bookmarks.data);
      if (!e.detail.bookmark) {
        this.bookmarks.removeItem(e.detail);
      } else this.bookmarks.addData(e.detail);
    });
    this.el.addEventListener('click', (e) => {
      if (e.target.classList.contains('toggle-bookmarks')) {
        this.bookmarks.el.classList.toggle('display-bookmarks');
      }
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
      this.list.addData(data.response.listings);
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
    this._displayWarning(warnText);
  }

  /**
     * creates a warning message to show if something's wrong
     */
  _createWarning () {
    this.warning = this._addDiv(['warning', 'warning-hidden']);
    this.el.insertBefore(this.warning, this.list.el);
  }

  /**
     * displays warning if something was wrong with the query
     * @param {string} text
     */
  _displayWarning (text) {
    this.warning.innerText = text;
    this.warning.classList.remove('warning-hidden');
  }

  _hideWarning() {
    this.warning.classList.add('warning-hidden');
  }
}
