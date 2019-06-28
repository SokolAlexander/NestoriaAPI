import {List} from './list.js';

export class BookmarksList extends List {
    constructor(htmlEl) {
        super(htmlEl);
        this.currentCount = 0;
        this.maxCount = 999;
        this._createDummy();
        this._showDummy();
    }

    removeItem() {
        this.data = this.data.filter( (item) => item.bookmark);
        this._render();
        if (this.data.length < 1) {
            this._createDummy();
            this._showDummy()
        };
    }

    addData(data) {
        this._hideDummy();
        super.addData(data);
    }

    _createDummy() {
        this.el.append(this._addDiv(['dummy', 'dummy-closed'], 'Nothing saved yet'));
    }

    _showDummy() {
        this.el.querySelector('.dummy').classList.remove('dummy-closed');
    }

    _hideDummy() {
        this.el.querySelector('.dummy').classList.add('dummy-closed');
    }
}