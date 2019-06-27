import {AbstractControl} from '../abstract/abstract.js';
import {Modal} from './modal.js';
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
    this.maxCount = 20;
    this.currentCount = 0;
    this.data = [];
    this._render();
    this._initEvents();
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
    this.modal = new Modal(this.el);
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
      if (e.target.classList.contains('button')) {
        this._showMore();
      } else if (e.target.classList.contains('modal-overlay')) {
        this.modal.hide();
      } else if (e.target.classList.contains('add-bookmark')) {
          this._addToBookmarks(e.target.dataset.index)
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
        this.modal.display(this.data[target.dataset.index]);
        break;
      } else target = target.parentNode;
    }
  }

  _addToBookmarks(index) {
    let bookmarkAdd = new CustomEvent('bookmarkAdd', 
        {bubbles: true, detail: this.data[index]});
        console.log(index);
    this.el.dispatchEvent(bookmarkAdd);
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
