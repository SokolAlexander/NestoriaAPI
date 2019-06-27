import { dataMock } from './data.js';

/**
 * class representing a list of places for rent
 */
export class List {
  /**
     * creates and renders a list inside htmlElement
     * @param {htmlEl} htmlEl
     */
  constructor (htmlEl) {
    this.el = htmlEl;
    this.maxCount = 20;
    this.currentCount = 0;
    this.data = dataMock;
    this._addDiv = this._addElement('div');
    this._render();
    this._initEvents();
  }

  /**
     * delete all html inside el and render a list of data
     */
  _render () {
    this.el.innerHTML = '';
    this.currentCount = 0;

    this._createWarning();
    this.ul = document.createElement('ul');
    this._appendLis();
    this.el.append(this.ul);
    this._appendButton();

    this._createModal();
  }

  /**
     * creates a warning message to show if something's wrong
     */
  _createWarning () {
    this.warning = this._addDiv(['warning', 'warning-hidden']);
    this.el.append(this.warning);
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
     * adds one html element with tagName and src (used for imgs)
     * @param {string} tagName
     * @param {string} src
     * @return function(Array of strings, string) => returns htmlEl
     */
  _addElement (tagName, src = '') {
    return function (CssClasses = [], innerText = '') {
      let el = document.createElement(tagName);
      el.innerText = innerText;
      if (src) el.src = src;

      CssClasses.forEach(CssClass => {
        el.classList.add(CssClass);
      });

      return el;
    };
  }

  /**
     * appends button 'show more' to el
     */
  _appendButton () {
    let button = this._addElement('a')(['button', 'show-more']);
    button.innerText = 'show more';
    this.el.append(button);
  }

  /**
     * check if we're on the last page,
     * if not, dispatch event to get next page
     */
  _showMore () {
    if (++this.currentPage > this.maxCount) return;
    let request = new CustomEvent('requestData',
      { bubbles: true, detail: { page: this.currentPage } });
    this.el.dispatchEvent(request);
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
        this._hideModal();
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
        this._displayModal(target.dataset.index);
        break;
      } else target = target.parentNode;
    }
  }

  /**
     * clear html of modal, fill it with new info,
     * open modal
     * @param {number} index number of item to show details for
     */
  _displayModal (index) {
    this.modal.innerHTML = '';
    this.modal.append(this._fillModal(index));
    this.modalOverlay.classList.remove('modal-closed');
    this.modal.classList.remove('modal-closed');
  }

  /**
     * fills the modal with details item with index
     * @param {number} index
     * @return {htmlEl}
     */
  _fillModal (index) {
    let modalGuts = this._addDiv(['modal-guts'], '');
    let modalInfo = this._addDiv(['modal-info'], '');

    let titleWrap = this._addDiv(['title-wrap'], '');
    let clearfix = this._addDiv(['clearfix'], '');
    let titleDiv = this._addDiv(['modal-title', 'title'], this.data[index].title);
    let priceDiv = this._addDiv(['modal-price', 'price'], this.data[index].price_formatted);
    titleWrap.append(titleDiv, priceDiv, clearfix);

    let imgWrap = this._addDiv(['modal-img-wrap'], '');
    let img = this._addElement('img', this.data[index].img_url)(['image']);
    imgWrap.append(img);

    let info = this._getDetailedText(this.data[index]);
    let textWrap = this._addDiv(['modal-text-wrap'], info);

    let linkToLister = document.createElement('a');
    linkToLister.href = this.data[index].lister_url;
    linkToLister.innerText = 'more details';

    modalInfo.append(titleWrap, imgWrap, textWrap);
    modalGuts.append(modalInfo, linkToLister);

    return modalGuts
  }

  _getDetailedText(item) {
    let lister_name = item.lister_name === undefined ?
     'Unknow Lister' : item.lister_name;
    return `${lister_name} on ${item.datasource_name}

    Property: ${item.property_type}
    Bathrooms: ${item.bathroom_number}
    Bedrooms: ${item.bedroom_number}

    ${item.summary}`;
  }

  /**
     * hides modal
     */
  _hideModal () {
    this.modalOverlay.classList.add('modal-closed');
    this.modal.classList.add('modal-closed');
  }

  /**
     * creates modal
     */
  _createModal () {
    this.modalOverlay = this._addDiv(['modal-overlay', 'modal-closed']);
    this.modal = this._addDiv(['modal', 'modal-closed']);
    this.el.append(this.modalOverlay, this.modal);
  }

  /**
     * adds data from the response to this.data
     * calls appendLis to render added items
     * (used in pagination)
     * @param {Array} response
     */
  addData (response) {
    this.data = this.data.concat(response.listings);
    this._appendLis();
  }

  /**
     * sets the data from the response to this.data
     * counts maxpages and currentPage for this query
     * calls render
     * used for new querys
     * @param {Array} response
     */
  setData (response) {
    this.data = response.listings;
    this.currentPage = response.page;
    this.maxPages = response.total_pages;
    this._render();
  }

  /**
     * displays warning if something was wrong with the query
     * @param {string} text
     */
  displayWarning (text) {
    this.warning.innerText = text;
    this.warning.classList.remove('warning-hidden');
  }
}
