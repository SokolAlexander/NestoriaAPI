export class Form {
    constructor(htmlEl) {
        this.el = htmlEl;

        this._initEvents();
    }

    _initEvents() {
        this.el.addEventListener('submit', e => this._submitForm(e));
    }

    _submitForm(e) {
        e.preventDefault();
        let formData = this._getFormData();
        let formSubmit = new CustomEvent('formSubmit', {bubbles: true, detail: formData});
        this.el.dispatchEvent(formSubmit);
    }

    _getFormData() {
        return this.el.querySelector('.form-text-input').value;
    }
}