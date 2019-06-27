import { AbstractControl } from "../abstract/abstract.js";

export class Modal extends AbstractControl {
    constructor(listEl) {
        super();
        this.listEl = listEl;
        
        this.modalOverlay = this._addDiv(['modal-overlay', 'modal-closed']);
        this.modal = this._addDiv(['modal', 'modal-closed']);
        this.listEl.append(this.modalOverlay, this.modal);
    }

    
  /**
     * clear html of modal, fill it with new info,
     * open modal
     * @param {number} index number of item to show details for
     */
  display (item) {
    this.modal.innerHTML = '';
    this.modal.append(this._fill(item));

    this.modalOverlay.classList.remove('modal-closed');
    this.modal.classList.remove('modal-closed');
  }

  /**
     * fills the modal with details item with index
     * @param {number} index
     * @return {htmlEl}
     */
  _fill (item) {
    let modalGuts = this._addDiv(['modal-guts'], '');
    let modalInfo = this._addDiv(['modal-info'], '');

    let titleWrap = this._addDiv(['title-wrap'], '');
    let clearfix = this._addDiv(['clearfix'], '');
    let titleDiv = this._addDiv(['modal-title', 'title'], item.title);
    let priceDiv = this._addDiv(['modal-price', 'price'], item.price_formatted);
    titleWrap.append(titleDiv, priceDiv, clearfix);

    let imgWrap = this._addDiv(['modal-img-wrap'], '');
    let img = this._addElement('img', item.img_url)(['image']);
    imgWrap.append(img);

    let info = this._getDetailedText(item);
    let textWrap = this._addDiv(['modal-text-wrap'], info);

    let linkToLister = this._addElement('a')(['outer-link'], 'more details');
    linkToLister.href = item.lister_url;

    let bookmarkAdd = this._addDiv(['add-bookmark'], 'Add');
    //bookmarkAdd.dataset.index = index;

    modalInfo.append(titleWrap, bookmarkAdd, imgWrap, textWrap);
    modalGuts.append(modalInfo, linkToLister);

    return modalGuts
  }

  /**
   * gets text for item details display
   * @param {Object} item 
   */
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
  hide () {
    this.modalOverlay.classList.add('modal-closed');
    this.modal.classList.add('modal-closed');
  }
}