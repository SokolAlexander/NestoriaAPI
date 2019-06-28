import {List} from './list.js';

export class BookmarksList extends List {
    constructor(htmlEl) {
        super(htmlEl);
    }

    removeItem(item) {
        this.data = this.data.filter( (item) => item.bookmark)
        this._render();
    }
}