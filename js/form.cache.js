/**************************************************************
 * 表单缓存插件
 * 1、使用localStorage进行数据缓存
 * 2、支持text, selector, checkbox, radio, textarea等控件缓存
 * 3、checkbox多数据使用','分隔保存数据
 * 4、数据统一储存在formData属性中，以'&'分隔
 ***************************************************************/

const FormCache = (() => {
    const localStorage = window.localStorage;

    class FormCache {
        constructor(selector, options) {
            this.form = document.querySelector(selector);
            this.options = options;
            this.states = {};
        }

        cache() {
            const {
                fields
            } = this.options;

            for (let key in fields) {
                if (fields[key].type === 'checkbox') {
                    this.states[key] = [];
                    for (let i = 0; i < this.form[key].length; i++) {
                        if (this.form[key][i].checked) {
                            this.states[key].push(this.form[key][i].value);
                        }
                    }
                    continue;
                }

                if (fields[key].type === 'radio') {
                    for (let i = 0; i < this.form[key].length; i++) {
                        if (this.form[key][i].checked) {
                            this.states[key] = this.form[key][i].value;
                            break;
                        }
                    }
                    continue;
                }

                this.states[key] = this.form[key].value;
            }

            this.setField2localStorage();
        }

        // fields储存在一个属性中
        setField2localStorage() {
            let arr = [];

            for (let key in this.states) {
                // 数组转字符串
                if (Object.prototype.toString.call(this.states[key]) === '[object Array]') {
                    arr.push(key + '=' + this.states[key].join());
                    continue;
                }

                arr.push(key + '=' + this.states[key]);
            }

            localStorage.setItem('formData', arr.join('&'));
        }

        getFieldFromlocalStorage() {
            let arr = localStorage.getItem('formData').split('&');

            for (let i = 0; i < arr.length; i++) {
                let arr2 = arr[i].split('=');

                if (arr2[1].indexOf(',') != -1) {
                    this.states[arr2[0]] = arr2[1].split(',');
                    continue;
                }

                this.states[arr2[0]] = arr2[1];
            }
        }

        reset(callback) {
            const {
                fields
            } = this.options;

            if (!localStorage.getItem('formData')) return;

            this.getFieldFromlocalStorage();

            for (let key in fields) {
                if (fields[key].type === 'checkbox') {
                    for (let i = 0; i < this.form[key].length; i++) {
                        for (let j = 0; j < this.states[key].length; j++) {
                            if (this.form[key][i].value == this.states[key][j]) {
                                this.form[key][i].checked = true;
                                break;
                            }
                        }
                    }
                    continue;
                }

                if (fields[key].type === 'radio') {
                    for (let i = 0; i < this.form[key].length; i++) {
                        if (this.form[key][i].value == this.states[key]) {
                            this.form[key][i].checked = true;
                            break;
                        }
                    }
                    continue;
                }

                this.form[key].value = this.states[key];
            }

            callback.call(this);
        }

        clear() {
            localStorage.removeItem('formData');
        }
    }

    return FormCache;
})();

export default FormCache;
