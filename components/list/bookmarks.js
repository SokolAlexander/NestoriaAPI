import { List } from './list.js';

/**
 * class represents a list of bookmarks
 */
export class BookmarksList extends List {
  /**
     * creates a list for bm
     * @param {htmlEl} htmlEl
     */
  constructor (htmlEl) {
    super(htmlEl);
    this.currentCount = 0;
    this.maxCount = 999;
    this._createDummy();
    this._showDummy();
  }

  /**
   * removes item from bookmarks
   * if data is empty, show dummy
   */
  removeItem () {
    this.data = this.data.filter((item) => item.bookmark);
    this._render();
    if (this.data.length < 1) {
      this._createDummy();
      this._showDummy();
    };
  }

  /**
   * adds item to bookmarks
   * @param {Object} data
   */
  addData (data) {
    this._hideDummy();
    super.addData(data);
  }

  /**
   * create dummy tto show if data is empty
   */
  _createDummy () {
    this.el.append(this._addDiv(['dummy', 'dummy-closed'], 'Nothing saved yet'));
  }

  /**
   * show dummy
   */
  _showDummy () {
    this.el.querySelector('.dummy').classList.remove('dummy-closed');
  }

  /**
   * hides dummy
   */
  _hideDummy () {
    this.el.querySelector('.dummy').classList.add('dummy-closed');
  }
}
