import {dataMock} from './data.js';

export class List {
    constructor(htmlEl) {
        this.el = htmlEl;
        this.maxCount = 20;
        this.currentCount = 0;
        this.data = dataMock;
        this._addDiv = this._addElement('div');
        this._render();
        this._initEvents();
    }

    _render() {
        this.el.innerHTML = '';
        this.currentCount = 0;

        this._createWarning();
        this.ul = document.createElement('ul');
        this._appendLis();
        this.el.append(this.ul);
        this._appendButton();

        this._createModal();
    }

    _createWarning() {
        this.warning = this._addDiv(['warning', 'warning-hidden'], '');
        this.el.append(this.warning);
    }

    _appendLis() {
        let i = this.currentCount;
        while ((i < this.maxCount + this.currentCount)&&(i< this.data.length)) {
            let li = document.createElement('li');
            li.dataset.index = i;

            let divWrap = this._addDiv(['wrap'],'');

            let divThumb = this._addDiv(['thumb'], '');
            let thumbnail = this._addElement('img', this.data[i].thumb_url)([]);
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
    
    _addElement(tagName, src = '') {
        return function(CssClasses = [], innerText = '') {
        let el = document.createElement(tagName);
        el.innerText = innerText;
        if (src) el.src = src;
    
        CssClasses.forEach(CssClass => {
            el.classList.add(CssClass); 
        });
    
        return el
        }
    }

    _appendButton() {
        let button = document.createElement('a');
        button.classList.add('button', 'show-more');
        button.innerText = 'show more';
        this.el.append(button);
    }

    _showMore() {
        if (++this.currentPage > this.maxCount) return;
        let request = new CustomEvent('requestData', 
            {bubbles: true, detail: {page: this.currentPage}});
        this.el.dispatchEvent(request);
    }

    _initEvents() {
        this.el.addEventListener('click', (e) => {
            if (e.target.classList.contains('button')) {
                this._showMore();
            } else if (e.target.classList.contains('modal-overlay')) {
                this._hideModal();
            } else this._checkForLi(e.target);
        })
    }

    /**
     * calls displayDetails if click was on li or li's chilnode
     * @param {*} target 
     */
    _checkForLi(target) {
        while (target !== this.el) {
            if (target.tagName === 'LI') {
                this._displayModal(target.dataset.index);
                break;
            } else target = target.parentNode;
        }
    }

    _displayModal(index) {
        this.modal.innerHTML = '';
        let modalInsideDiv = this._fillModal(index);
        this.modal.append(modalInsideDiv);
        this.modalOverlay.classList.remove('modal-closed');
        this.modal.classList.remove('modal-closed');
    }

    _fillModal(index) {
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

        let info = `${this.data[index].lister_name} on ${this.data[index].datasource_name}

        Property: ${this.data[index].property_type}
        Bathrooms: ${this.data[index].bathroom_number}
        Bedrooms: ${this.data[index].bedroom_number}

        ${this.data[index].summary}`;
        let textWrap = this._addDiv(['modal-text-wrap'], info);

        let linkToLister = document.createElement('a');
        linkToLister.href = this.data[index].lister_url;
        linkToLister.innerText = 'more details';
        
        modalInfo.append(titleWrap, imgWrap, textWrap);

        modalGuts.append(modalInfo, linkToLister);

        return modalGuts
    }

    _hideModal() {
        this.modalOverlay.classList.add('modal-closed');
        this.modal.classList.add('modal-closed');
    }

    _createModal() {
        this.modalOverlay = this._addDiv(['modal-overlay', 'modal-closed'], '');
        this.modal = this._addDiv(['modal', 'modal-closed'], '');
        this.el.append(this.modalOverlay, this.modal);
    }

    addData(response) {
        this.data = this.data.concat(response.listings);
        this._appendLis();
    }

    setData(response) {
        this.data = response.listings;
        this.currentPage = response.page;
        this.maxPages = response.total_pages;
        this._render();
    }

    displayWarning(text) {
        this.warning.innerText = text;
        this.warning.classList.remove('warning-hidden');
    }
}

