import {Form} from '../form/form.js';
import {List} from '../list/list.js';
import {ApiWorker} from '../apiWorker/apiWorker.js';
export class App {
    constructor(htmlEl) {
        this.el = htmlEl;
        this.form = new Form(this.el.querySelector('.form'));
        this.list = new List(this.el.querySelector('.list'));
        this.apiWorker = new ApiWorker(this);

        this._initEvents();
    }

    _initEvents() {
        this.el.addEventListener('formSubmit', e => {
            this.apiWorker.getListings(e.detail);
        });
        this.el.addEventListener('requestData', (e) => {
            this.apiWorker.getNextPage(e.detail.page);
        });
    }

    takeData(data) {
        console.log(data.response);
        if (data.response.page === 1) {
            this.list.setData(data.response)
            } else {
                this.list.addData(data.response)
            }

    }
}