import jQuery from 'jquery';

var FormDate = (function ($) {
  function formatDate(date) {
    var month = date.getMonth() + 1,
      year = date.getFullYear(),
      day = date.getDate();

    return year + '年' + month + '月' + day + '日';
  }

  function formatTime(date) {
    var hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds(),
      milliseconds = date.getMilliseconds();

    return hours + ':' + minutes + ':' + seconds + ':' + milliseconds;
  }

  var dayMS = 1000 * 3600 * 24; // 一天毫秒数

  function FormDate(selector) {
    var $input = $(selector),
      $dateSelector = $input.parent(),
      $selector = $dateSelector.find('.selector'),
      $weeks = this.$weeks = $selector.find('.weeks'),
      $days = this.$days = $selector.find('.days'),
      $months = this.$months = $selector.find('.months'),
      $top = $selector.find('.top'),
      $text = $top.find('.text'),
      $prev = $top.find('.prev'),
      $next = $top.find('.next'),
      _this = this,

      blur = true, // 判断失焦隐藏是否启动
      firstFocus = true,
      selectType = 'day'; // 判断上下按钮功能

    // 初始化
    var selectedDate;
    if ($input.data('date')) {
      selectedDate = new Date($input.data('date'));
    } else {
      selectedDate = new Date();
    }
    $input.val(formatDate(selectedDate));
    this.selectedDate = selectedDate;

    // 设置顶部显示
    this.setText = function () {
      if (selectType == 'day') {
        $text.text(_this.showDate.getFullYear() + '年' + (_this.showDate.getMonth() + 1) + '月');
      } else {
        $text.text(_this.showDate.getFullYear() + '年');
      }
    };

    // 添加监听
    $input.on('focus', function () {
      if (firstFocus) {
        firstFocus = false;

        _this.showDate = _this.selectedDate;

        _this.setText();
        _this.generateDays();
        _this.generateMonths();
      }
    });
    $input.on('blur', function () {
      if (!blur) {
        $(this).focus();
      } else {
        firstFocus = true;
      }
    });
    $selector.on('mouseover', function () {
      blur = false;
    });
    $selector.on('mouseout', function () {
      blur = true;
    });
    $prev.on('click', function () {
        // 根据显示情况，选择按钮控制功能
      if (selectType == 'day') {
        var month = _this.showDate.getMonth();

        // 防止月份溢出
        if (month <= 0) {
          _this.showDate = new Date((_this.showDate.getFullYear() - 1) + '-12' + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
        } else {
          _this.showDate = new Date(_this.showDate.getFullYear() + '-' + month + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
        }
      } else if (selectType == 'month') {
        _this.showDate = new Date((_this.showDate.getFullYear() - 1) + '-' + (_this.showDate.getMonth() + 1) + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
      }

      // DOM渲染
      _this.setText();
      _this.generateDays();
      _this.generateMonths();
      // console.log(_this.showDate.toLocaleString());
    });
    $next.on('click', function () {
      // 根据显示情况，选择按钮控制功能
      if (selectType == 'day') {
        var month = _this.showDate.getMonth();

        // 防止月份溢出
        if (month >= 11) {
          _this.showDate = new Date((_this.showDate.getFullYear() + 1) + '-1' + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
        } else {
          _this.showDate = new Date(_this.showDate.getFullYear() + '-' + (month + 2) + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
        }
      } else if (selectType == 'month') {
        _this.showDate = new Date((_this.showDate.getFullYear() + 1) + '-' + (_this.showDate.getMonth() + 1) + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));
      }

      _this.setText();
      _this.generateDays();
      _this.generateMonths();
      // console.log(_this.showDate.toLocaleString());
    });
    $days.on('click', function (e) {
      var target = e.srcElement || e.target,
        $day = $(target),
        text = $day.text();

      if ($day.hasClass('last-month-day')) {
        _this.selectedDate = new Date(_this.showDate.getFullYear() + '-' + _this.showDate.getMonth() + '-' + text);
      } else if ($day.hasClass('next-month-day')) {
        _this.selectedDate = new Date(_this.showDate.getFullYear() + '-' + (_this.showDate.getMonth() + 2) + '-' + text);
      } else {
        _this.selectedDate = new Date(_this.showDate.getFullYear() + '-' + (_this.showDate.getMonth() + 1) + '-' + text);
      }

      blur = true;
      $input.blur();
      $input.val(formatDate(_this.selectedDate));
    });
    $months.on('click', function (e) {
      var target = e.srcElement || e.target,
        $month = $(target);

      _this.showDate = new Date(_this.showDate.getFullYear() + '-' + $month.data('month') + '-' + _this.showDate.getDate() + ' ' + formatTime(_this.showDate));

      _this.generateDays();
      $text.click();
    });
    $text.on('click', function () {
      if (selectType == 'day') {
        selectType = 'month';

        $weeks.css('display', 'none');
        $days.css('display', 'none');
        $months.css('display', 'block');
      } else if (selectType == 'month') {
        selectType = 'day';

        $weeks.css('display', 'block');
        $days.css('display', 'block');
        $months.css('display', 'none');
      }

      _this.setText();
    });
  }

  FormDate.prototype.generateDays = function () {
    var _this = this;

    // 获取该月一号日期
    var startDate = new Date(this.showDate.valueOf());
    startDate.setDate(1);
    // 获取星期下标
    var startIndex = startDate.getDay(), // 星期下标
      generateDate = new Date(startDate.valueOf() - dayMS * startIndex); // 创建生成DOM节点使用日期

    // 清空days
    this.$days.html('');
    // 根据Date对象，生成42天，可能包括上月份和下月份的
    for (var i = 0; i < 42; i++) {
      // 动态生成天的dom节点
      var $temple = $('<a>');
      $temple.text(generateDate.getDate());
      // 非当前月份的，样式修改
      if (i < startIndex) {
        $temple.addClass('dark last-month-day');
      } else if (generateDate.getMonth() > startDate.getMonth()) {
        $temple.addClass('dark next-month-day');
      } else if (generateDate.valueOf() == _this.selectedDate.valueOf()) {
        $temple.addClass('selected');
      }
      // 渲染DOM
      this.$days.append($temple);
      // 增加一天
      generateDate = new Date(generateDate.valueOf() + dayMS);
    }
  };

  FormDate.prototype.generateMonths = function () {
    var _this = this;

    _this.$months.html('');
    for (var i = 1; i <= 12; i++) {
      var $temple = $('<a data-month="' + i +'">');
      $temple.text(i + '月');

      if (i == (_this.selectedDate.getMonth() + 1) && _this.selectedDate.getFullYear() == _this.showDate.getFullYear()) {
        $temple.addClass('selected');
      }

      _this.$months.append($temple);
    }
  };

  return FormDate;
})(jQuery);

export default FormDate;
