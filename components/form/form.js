/**
 * class represents a form for searching
 */
export class Form {
  /**
     * gets form inside htmlEl
     * @param {htmlEl} htmlEl
     */
  constructor (htmlEl) {
    this.el = htmlEl;
    this._initEvents();
  }

  /**
     * adds EventListener for submitting form
     */
  _initEvents () {
    this.el.addEventListener('submit', e => this._submitForm(e));
  }

  /**
     * dispatches custom event to submit form to app
     * @param {Event} e
     */
  _submitForm (e) {
    e.preventDefault();
    let formData = this._getFormData();
    let formSubmit = new CustomEvent('formSubmit', { bubbles: true, detail: formData });
    this.el.dispatchEvent(formSubmit);
  }

  /**
     * returns value of text input
     */
  _getFormData () {
    return this.el.querySelector('.form-text-input').value;
  }
}
