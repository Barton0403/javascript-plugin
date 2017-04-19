const Form = (() => {
    class Form {
        constructor(selector, options) {
            this.form = document.querySelector(selector);
            this.options = options;
            this.states = {};
        }
    }

    return Form;
})();

export default Form;
