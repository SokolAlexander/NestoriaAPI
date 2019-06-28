export class AbstractControl {
    constructor() {
        this._addDiv = this._addElement('div');
    }

  /**
     * adds one html element with tagName and src (used for imgs)
     * @param {string} tagName
     * @param {string} src
     * @return function(Array of strings, string) => returns htmlEl
     */

    _addElement (tagName, src = '') {
        return function (CssClasses = [], innerText = '') {
          let el = document.createElement(tagName);
          el.innerText = innerText;
          if (src) el.src = src;

          CssClasses.forEach(CssClass => {
            el.classList.add(CssClass);
          });
    
          return el;
        };
      }
}