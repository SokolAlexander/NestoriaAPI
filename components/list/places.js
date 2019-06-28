import {List} from './list.js';

export class PlacesList extends List {
    constructor(htmlEl) {
        super(htmlEl);
        
        this.maxCount = 20;
        this.currentCount = 0;
        this._appendButton();
    }

  /**
     * appends button 'show more' to el
     */
    _appendButton () {
        let button = this._addElement('a')(['button', 'show-more']);
        button.dataset.action = 'show-more';
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
    
}