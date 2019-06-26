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
    }

    takeData(data) {
        console.log(data.response);
        this.list.setData(data.response);
    }
}