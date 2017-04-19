import jQuery from 'jquery';

/**************************************************************
 * 表单检测插件
 * 1、支持text, selector, checkbox, radio, textarea等控件检测
 * 2、自带telephone、email等验证
 ***************************************************************/

const FormCheck = (($) => {

    class FormCheck {
        constructor(selector, options) {
            this.form = document.querySelector(selector);
            this.options = options;
            this.states = {};
        }

        setDOM(msgEl, value, inputEl, cls) {
            $(inputEl).addClass(cls);
            msgEl.innerText = value;
        }

        clearDOM(msgEl, inputEl) {
            $(inputEl).removeClass('error');
            msgEl.innerText = '';
        }

        check() {
            const {
                fields
            } = this.options;
            let isOk = 1; // 默认检测通过

            for (let key in fields) {
                const msgEl = document.querySelector(fields[key].selector),
                      inputEl = this.form[key],
                      value = $.trim(this.form[key].value);

                // 判断是否为空
                if (fields[key].validators.notEmpty) {
                    if (fields[key].type === 'checkbox') { // 区别多选项控件
                        // 判断是否有选中的
                        let hasChecked = false;
                        for (let i = 0; i < inputEl.length; i++) {
                            if (inputEl[i].checked) {
                                hasChecked = true;
                                break;
                            }
                        }

                        if (!hasChecked) {
                            isOk = 0;
                            this.setDOM(msgEl, fields[key].validators.notEmpty.message, inputEl, 'error');
                            continue;
                        }
                    } else if (value.length < 1) { // 一般控件
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.notEmpty.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 如果允许空，并且值为空，无需继续验证
                if (value.length < 1) {
                    $(inputEl).removeClass('error');
                    msgEl.innerText = '';
                    continue;
                }

                // 判断字符长度
                if (fields[key].validators.stringLength) {
                    let max = fields[key].validators.stringLength.max,
                        min = fields[key].validators.stringLength.min;

                    if (max && value.length > max) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.stringLength.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }

                    if (min && value.length < min) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.stringLength.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 正则表达式验证
                if (fields[key].validators.regexp) {
                    if (!value.match(fields[key].validators.regexp.regexp)) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.regexp.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 相同验证
                if (fields[key].validators.same) {
                    const value2 = $.trim(this.form[fields[key].validators.same.field].value);
                    if (value != value2) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.same.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // callback验证
                if (fields[key].validators.callback) {
                    if (!fields[key].validators.callback.callback.call(this, value)) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.callback.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 手机验证
                if (fields[key].validators.mobilePhone) {
                    if (!value.match(/^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/)) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.mobilePhone.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 电话验证
                if (fields[key].validators.telephone) {
                    if (!value.match(/^(0\d{2}-\d{8}(-\d{1,4})?)|(0\d{3}-\d{7,8}(-\d{1,4})?)$/)) {
                        isOk = 0;
                        this.setDOM(msgEl, fields[key].validators.telephone.message, inputEl, 'error');
                        continue; // 验证不通过，不进行该值的后续验证，直接跳到下个值的验证
                    }
                }

                // 该值全部验证通过
                this.clearDOM(msgEl, inputEl);
            }

            if (isOk === 1) return true;
            else return false;
        }
    }

    return FormCheck;
})(jQuery);

export default FormCheck;
