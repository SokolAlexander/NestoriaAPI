export class List {
    constructor(htmlEl) {
        this.el = htmlEl;
        this.maxCount = 3;
        this.currentCount = 0;
        this.data = [{
            title: '1_______________________________________1',
            price_formatted: 10
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        },
        {
            title: 1,
            price: 1
        }];
        this._render();
        this._initEvents();
    }

    _render() {
        this.el.innerHTML = '';
        this.ul = document.createElement('ul');
        this._appendLis();
        this.el.appendChild(this.ul);
        this._appendButton();

    }

    _appendLis() {
        let i = this.currentCount;
        while ((i < this.maxCount + this.currentCount)&&(i< this.data.length)) {
            let li = document.createElement('li');
            let divWrap = this._addDiv('wrap','');
            let divTitle = this._addDiv('title', this.data[i].title);
            let divPrice = this._addDiv('price', this.data[i].price);
            let divSummary = this._addDiv('summary', this.data[i].summary);

            divWrap.appendChild(divTitle);
            divWrap.appendChild(divPrice);

            li.appendChild(divWrap);
            li.appendChild(divSummary);

            this.ul.appendChild(li);

            i++;
        }

        this.currentCount = i;
    }

    _addDiv(CssClass, innerText) {
        let div = document.createElement('div');
        div.innerText = innerText;
        div.classList.add(CssClass);
        return div;
    }

    _appendButton() {
        let button = document.createElement('a');
        button.classList.add('button', 'show-more');
        button.innerText = 'show more';
        this.el.appendChild(button);
    }

    _showMore() {
        this._appendLis();
    }

    _initEvents() {
        let button = this.el.querySelector('a');
        button.addEventListener('click', () => this._showMore())
    }

    setData(response) {
        this.data = response.listings;
        this._render();
    }
}