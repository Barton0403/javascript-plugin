/**************************************************************
* 表单缓存插件
* 1、使用localStorage进行数据缓存
* 2、支持text, selector, checkbox, radio等控件缓存
* 3、checkbox使用数组保存数据
***************************************************************/

const Form = (($) => {
  const localStorage = window.localStorage;

  class Form {
    constructor(selector, options) {
      this.form = document.querySelector(selector);
      this.options = {
        formItemNames: []
      };

      this.states = {};

      if (options) $.extend(this.options, options);
    }

    cache() {
      const {
        formItemNames
      } = this.options;
      const _this = this;

      // 获取需缓存控件的值
      for (let i = 0; i < formItemNames.length; i++) {
        let formItem = this.form[formItemNames[i]];

        // 多选项控件特殊处理
        if (formItem.toString() === '[object RadioNodeList]' && formItem[0].type === 'checkbox') {
          this.states[formItemNames[i]] = [];
          for (let j = 0; j < formItem.length; j++) {
            if (formItem[j].checked)
              this.states[formItemNames[i]].push(formItem[j].value);
          }

          // 将数组转换为字符串存入
          localStorage.setItem(formItemNames[i], _this.states[formItemNames[i]].join());
          continue;
        }

        this.states[formItemNames[i]] = formItem.value;
        localStorage.setItem(formItemNames[i], formItem.value);
      }
    }

    reset() {
      const {
        formItemNames
      } = this.options;

      for (let i = 0; i < formItemNames.length; i++) {
        // 不存在缓存直接跳过此次循环
        if (!localStorage[formItemNames[i]]) continue;

        let formItem = this.form[formItemNames[i]];

        // 多选项控件特殊处理
        if (formItem.toString() === '[object RadioNodeList]' && formItem[0].type === 'checkbox') {
          // 将数组转换为字符串存入
          let arrs = this.states[formItemNames[i]] = localStorage.getItem(formItemNames[i]).split(',');

          for (let j = 0; j < arrs.length; j++) {
            for (let k = 0; k < formItem.length; k++) {
              if (formItem[k].value === arrs[j]) formItem[k].checked = true;
            }
          }

          continue;
        }

        formItem.value = this.states[formItemNames[i]] = localStorage.getItem(formItemNames[i]);
      }
    }

    clear() {
      const {
        formItemNames
      } = this.options;

      for (let i = 0; i < formItemNames.length; i++) {
        localStorage.removeItem(formItemNames[i]);
      }
    }
  }

  return Form;
})(jQuery);
