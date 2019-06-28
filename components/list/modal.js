import { AbstractControl } from '../abstract/abstract.js';

/**
 * a class for modal window
 */
export class Modal extends AbstractControl {
  /**
   * create modal window
   */
  constructor () {
    super();

    this.modalOverlay = this._addDiv(['modal-overlay', 'modal-closed']);
    this.modalOverlay.dataset.action = 'hide-modal';
    this.modalWindow = this._addDiv(['modal', 'modal-closed']);
  }

  /**
     * clear html of modal, fill it with new info,
     * open modal
     * @param {number} index number of item to show details for
     */
  display (item, index) {
    this.modalWindow.innerHTML = '';
    this.modalWindow.append(this._fill(item, index));

    this.modalOverlay.classList.remove('modal-closed');
    this.modalWindow.classList.remove('modal-closed');
  }

  /**
     * fills the modal with details item with index
     * @param {number} index
     * @return {htmlEl}
     */
  _fill (item, index) {
    let modalGuts = this._addDiv(['modal-guts'], '');
    let modalInfo = this._addDiv(['modal-info'], '');

    let titleWrap = this._addDiv(['title-wrap'], '');
    let clearfix = this._addDiv(['clearfix'], '');
    let titleDiv = this._addDiv(['modal-title', 'title'], item.title);
    let priceDiv = this._addDiv(['modal-price', 'price'], item.price_formatted);
    titleWrap.append(titleDiv, priceDiv, clearfix);

    let buttonCssClass = ['add-bookmark'];
    let buttonInnerText = 'Add';
    let buttonAction = 'add-bookmark';
    if (item.bookmark) {
      buttonCssClass = ['remove-bookmark'];
      buttonInnerText = 'Remove';
      buttonAction = 'remove-bookmark';
    }
    let bookmarkButton = this._addDiv(buttonCssClass, buttonInnerText);
    bookmarkButton.dataset.action = buttonAction;
    bookmarkButton.dataset.index = index;

    let imgWrap = this._addDiv(['modal-img-wrap'], '');
    let img = this._addElement('img', item.img_url)(['image']);
    imgWrap.append(img);

    let info = this._getDetailedText(item);
    let textWrap = this._addDiv(['modal-text-wrap'], info);

    let linkToLister = this._addElement('a')(['outer-link'], 'more details');
    linkToLister.href = item.lister_url;
    //

    modalInfo.append(titleWrap, bookmarkButton, imgWrap, textWrap);
    modalGuts.append(modalInfo, linkToLister);

    return modalGuts;
  }

  /**
   * gets text for item details display
   * @param {Object} item
   */
  _getDetailedText (item) {
    let lister_name = item.lister_name === undefined
      ? 'Unknow Lister' : item.lister_name;
    return `${lister_name} on ${item.datasource_name}

    Property: ${item.property_type}
    Bathrooms: ${item.bathroom_number}
    Bedrooms: ${item.bedroom_number}

    ${item.summary}`;
  }

  /**
     * hides modal
     */
  hide () {
    this.modalOverlay.classList.add('modal-closed');
    this.modalWindow.classList.add('modal-closed');
  }
}
