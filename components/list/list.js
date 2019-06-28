import { AbstractControl } from '../abstract/abstract.js';
import { Modal } from './modal.js';
/**
 * class representing a list of places for rent
 */
export class List extends AbstractControl {
  /**
   * creates and renders a list inside htmlElement
   * @param {htmlEl} htmlEl
   */
  constructor (htmlEl) {
    super();
    this.el = htmlEl;
    this.data = [];

    this.modal = new Modal();
    this.actions = {
      'show-more': this._showMore.bind(this),
      'hide-modal': this.modal.hide.bind(this.modal),
      'add-bookmark': this._addToBookmarks.bind(this),
      'remove-bookmark': this._removeBookmark.bind(this)
    };

    this._render();
    this._initEvents();
  }

  /**
   * dummy
   */
  _showMore () {
  }

  /**
   * removes bookmark from bookmarkslist
   * @param {htmlEl} target
   */
  _removeBookmark (target) {
    this._swapButton(target, 'remove-bookmark', 'add-bookmark', 'Add');
    this._changeBookmarks(target);
  }

  /**
   * dispatches event for adding of removing item in bookmarks
   * @param {htmlEl} target
   */
  _changeBookmarks (target) {
    this.data[target.dataset.index].bookmark = !this.data[target.dataset.index].bookmark;
    let bookmarkChange = new CustomEvent('bookmarkChange',
      { bubbles: true, detail: this.data[target.dataset.index] });
    console.log(target.dataset.index);
    this.el.dispatchEvent(bookmarkChange);
  }

  /**
   * changes button Add to Remove or vice versa
   * @param {htmlEl} target
   * @param {string} toRemove
   * @param {string} toAdd
   * @param {string} text
   */
  _swapButton (target, toRemove, toAdd, text) {
    target.classList.remove(toRemove);
    target.classList.add(toAdd);
    target.dataset.action = toAdd;
    target.innerText = text;
  }

  /**
     * delete all html inside el and render a list of data
     */
  _render () {
    this.el.innerHTML = '';
    this.currentCount = 0;

    this.ul = document.createElement('ul');
    this._appendLis();
    this.el.append(this.ul);
    this.el.append(this.modal.modalWindow);
    this.el.append(this.modal.modalOverlay);
  }

  /**
     * appends li elements to ul, saves count of items displayed
     */
  _appendLis () {
    let i = this.currentCount;
    while ((i < this.maxCount + this.currentCount) && (i < this.data.length)) {
      let li = document.createElement('li');
      li.dataset.index = i;

      let divWrap = this._addDiv(['wrap']);

      let divThumb = this._addDiv(['thumb']);
      let thumbnail = this._addElement('img', this.data[i].thumb_url)();
      divThumb.append(thumbnail);

      let divTitle = this._addDiv(['title'], this.data[i].title);
      let divPrice = this._addDiv(['price'], this.data[i].price_formatted);

      let divKeywords = this._addDiv(['keywords'], this.data[i].keywords);

      divWrap.append(divThumb, divTitle, divPrice);
      li.append(divWrap, divKeywords);

      this.ul.append(li);

      i++;
    }

    this.currentCount = i;
  }

  /**
     * adds eventListeners for opening/closing modal,
     * and for getting more listings
     */
  _initEvents () {
    this.el.addEventListener('click', (e) => {
      if (e.target.dataset.action in this.actions) {
        this.actions[e.target.dataset.action](e.target);
      } else this._checkForLi(e.target);
    });
  }

  /**
     * calls displayDetails if click was on li or li's chilnode
     * @param {htmlEl} target
     */
  _checkForLi (target) {
    while (target !== this.el) {
      if (target.tagName === 'LI') {
        this.modal.display(this.data[target.dataset.index], target.dataset.index);
        break;
      } else target = target.parentNode;
    }
  }

  /**
   * adds item to bookmarks
   * @param {htmlEl} target
   */
  _addToBookmarks (target) {
    this._swapButton(target, 'add-bookmark', 'remove-bookmark', 'Remove');
    this._changeBookmarks(target);
  }

  /**
     * adds data from the response to this.data
     * calls appendLis to render added items
     * (used in pagination)
     * @param {Array} response
     */
  addData (listings) {
    this.data = this.data.concat(listings);
    this._appendLis();
  }
}
