import jQuery from 'jquery';

/**************************************************************
 * 表单检测插件
 * 1、支持text, selector, checkbox, radio, textarea等控件检测
 * 2、自带telephone、email等验证
 * 注意：由于IE堆栈机制，IE9以下不支持oninput的监听
 ***************************************************************/

const FormCheck = (($) => {
    class FormCheck {
        constructor(selector, options) {
            this.form = document.querySelector(selector);
            this.options = options;
            this.states = {};

            this.setListener();
        }

        setDOM(msgEl, value, inputEl, cls) {
            $(inputEl).addClass(cls);
            msgEl.innerText = value;
        }

        clearDOM(msgEl, inputEl) {
            $(inputEl).removeClass('error');
            msgEl.innerText = '';
        }

        setListener() {
            const {
                fields
            } = this.options;

            for (let key in fields) {
                const inputEl = this.form[key],
                    field = fields[key];

                // 失焦监听
                if (field.validators.onblur) {
                    $(inputEl).on('blur', () => {
                        this.checkOne(key, field);
                    });
                }

                // 输入监听
                if (field.validators.oninput) {
                    $(inputEl).on('input', () => {
                        this.checkOne(key, field);
                    });
                }
            }
        }

        checkOne(key, field) {
            const {
                fields
            } = this.options;

            const msgEl = document.querySelector(field.selector),
                  inputEl = this.form[key],
                  value = $.trim(inputEl.value);

            // 清除上次验证
            this.clearDOM(msgEl, inputEl);

            // 如果允许空，并且值为空，无需继续验证
            if (!field.validators.notEmpty && value.length < 1) {
                return true;
            }

            if (field.validators.notEmpty && !FormCheck.checkByNotEmpty(field, value, inputEl)) {
                this.setDOM(msgEl, field.validators.notEmpty.message, inputEl, 'error');
                return false;
            }

            if (field.validators.stringLength && !FormCheck.checkByStringLength(field, value)) {
                this.setDOM(msgEl, field.validators.stringLength.message, inputEl, 'error');
                return false;
            }

            if (field.validators.range && !FormCheck.checkByRange(field, value)) {
                this.setDOM(msgEl, field.validators.range.message, inputEl, 'error');
                return false;
            }

            if (field.validators.regexp && !FormCheck.checkByRegexp(field, value)) {
                this.setDOM(msgEl, field.validators.regexp.message, inputEl, 'error');
                return false;
            }

            if (field.validators.same) {
                const msgEl2 = document.querySelector(fields[field.validators.same.field].selector),
                    inputEl2 =  this.form[field.validators.same.field],
                    value2 = $.trim(inputEl2.value);
                if (!FormCheck.checkBySame(field, value, value2)) {
                    this.setDOM(msgEl, field.validators.same.message, inputEl, 'error');
                    return false;
                } else {
                    this.clearDOM(msgEl2, inputEl2);
                }
            }

            if (field.validators.callback && !FormCheck.checkByCallback(field, value)) {
                this.setDOM(msgEl, field.validators.callback.message, inputEl, 'error');
                return false;
            }

            if (field.validators.mobilePhone && !FormCheck.checkByMobilePhone(field, value)) {
                this.setDOM(msgEl, field.validators.mobilePhone.message, inputEl, 'error');
                return false;
            }

            if (field.validators.telephone && !FormCheck.checkByTelephone(field, value)) {
                this.setDOM(msgEl, field.validators.telephone.message, inputEl, 'error');
                return false;
            }

            if (field.validators.number && !FormCheck.checkByNumber(field, value)) {
                this.setDOM(msgEl, field.validators.number.message, inputEl, 'error');
                return false;
            }

            return true;
        }

        checkAll() {
            const {
                fields
            } = this.options;
            let isOk = 1; // 默认检测通过

            for (let key in fields) {
                if (!this.checkOne(key, fields[key])) isOk = 0;
            }

            if (isOk === 1) return true;
            else return false;
        }

        static checkByNotEmpty(field, value, inputEl) {
            if (field.type === 'checkbox') { // 区别多选项控件
                // 判断是否有选中的
                let hasChecked = false;
                for (let i = 0; i < inputEl.length; i++) {
                    if (inputEl[i].checked) {
                        hasChecked = true;
                        break;
                    }
                }

                if (!hasChecked) {
                    return false;
                }
            } else if (value.length < 1) { // 一般控件
                return false;
            }

            return true;
        }

        static checkByStringLength(field, value) {
            let max = field.validators.stringLength.max,
                min = field.validators.stringLength.min;

            if (max && value.length > max) {
                return false;
            }

            if (min && value.length < min) {
                return false;
            }

            return true;
        }

        static checkByRange(field, value) {
            const max = field.validators.range.max,
                  min = field.validators.range.min;
            let _isOk = 1;

            switch (field.validators.range.type) {
                case 'Integer':
                    if (max && parseInt(value) > max) {
                        _isOk = 0;
                        break;
                    }

                    if ((min || min === 0) && parseInt(value) < min) {
                        _isOk = 0;
                        break;
                    }
                    break;
                case 'float':
                    if (max && parseFloat(value) > max) {
                        _isOk = 0;
                        break;
                    }

                    if ((min || min === 0) && parseFloat(value) < min) {
                        _isOk = 0;
                        break;
                    }
                    break;
                default:
                    _isOk = 1;
            }

            if (_isOk === 0) {
                return false;
            }

            return true;
        }

        static checkByRegexp(field, value) {
            if (!value.match(field.validators.regexp.regexp)) {
                return false;
            }

            return true;
        }

        static checkBySame(field, value, value2) {
            if (value != value2) {
                return false;
            }

            return true;
        }

        static checkByCallback(field, value) {
            if (!field.validators.callback.callback.call(this, value)) {
                return false;
            }

            return true;
        }

        static checkByMobilePhone(field, value) {
            if (!value.match(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/)) {
                return false;
            }

            return true;
        }

        static checkByTelephone(field, value) {
            if (!value.match(/^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/)) {
                return false;
            }

            return true;
        }

        static checkByNumber(field, value) {
            if (field.validators.number.type === 'Integer' && !value.match(/^\d*$/)) {
                return false;
            }

            if (field.validators.number.type === 'float' && !value.match(/^\d*[.]?\d*$/)) {
                return false;
            }

            return true;
        }
    }

    return FormCheck;
})(jQuery);

export default FormCheck;
