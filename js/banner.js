import jQuery from 'jquery';

/**************************************************************
* banner轮播插件
* 1、实现无缝轮播
* 2、使用了jquery插件
* 3、兼容IE7
*
* 注意：由于是无缝轮播，在头部和尾部各多加了张图片，初始下标从1开始
***************************************************************/

const Banner = (($) => {
  let index = 1, // banner下标
      width = null, // banner宽度
      length = null, // banner总数
      isAutoPlayStop = false, // 是否停止自动轮播
      autoPlayTimer, // 自动轮播timer
      isTransition = false; // 过渡状态

  class Banner {
    constructor(selector, options) {
      const banner = $(selector)[0];

      this.props = {
        banner,
        bannerBody: $(banner).find('.bd')[0],
        banners: $(banner).find('.bd .banner_item'),
        indexBody: $(banner).find('.index_bd')[0],
        indexs: $(banner).find('.index_bd>a'),
        controlBody: $(banner).find('.control_bd')[0],
        prevBtn: $(banner).find('.control_bd .prev')[0],
        nextBtn: $(banner).find('.control_bd .next')[0]
      };

      length = this.props.banners.length; // 获取banner数量
      width = banner.clientWidth; // 获取banner宽度

      // 參数
      this.options = {
          showIndexs: true,
          showControl: true,
          autoPlayTime: 2000,
          auto: true,
          transitionTime: 350
      };
      // 合并自定义參数
      if (options) {
          $.extend(this.options, options);
      }
    }

    init() {
      const {
        auto
      } = this.options;

      this.initView();
      this.initListener();
      if (auto) this.startAutoPlay();
    }

    initListener() {
      const {
        nextBtn,
        prevBtn,
        indexBody,
        banner
      } = this.props,
      { auto } = this.options;

      // 鼠标浮动监听
      banner.onmouseenter = () => {
          if (!isAutoPlayStop) {
              isAutoPlayStop = true;
              // 还没过渡，直接清除自动轮播timer
              if (!isTransition) clearTimeout(autoPlayTimer);
          }
      };
      banner.onmouseleave = () => {
          if (isAutoPlayStop) {
              isAutoPlayStop = false;
              // 防止重复自动轮播定时器重复
              if (auto && !isTransition) {
                this.startAutoPlay();
              }
          }
      };

      nextBtn.onclick = () => {
        if (!isTransition) {
          this.next();
        }
      };
      prevBtn.onclick = () => {
        if (!isTransition) {
          this.prev();
        }
      };
      indexBody.onclick = (e) => {
        // IE8兼容性
        e = e || window.event;
        let target = e.srcElement || e.target;

        if (!isTransition && target.nodeName === 'A') {
          this.go(parseInt($(target).data('index')));

        }
      };
    }

    initView() {
      const {
        banners,
        bannerBody,
        indexBody
      } = this.props;

      // 动态居中下标控制器
      indexBody.style.marginLeft = -indexBody.clientWidth / 2 + 'px';

      // 使用绝对定位排序，方便轮播定位
      $.each(banners, (i, banner) => {
          banner.style.left = i * width + 'px';
      });

      // 设置轮播初始定位
      bannerBody.style.left = -banners[index].offsetLeft + 'px';
    }

    prev() {
      // 下标更改
      index--;
      this.resetIndexClass(); // 更改下标样式

      // 开始过渡
      this.transition(() => {
        isTransition = false;
        this.resetBannerBodyPosition(); // 重置轮播定位
      });
    }

    next() {
      // 下标更改
      index++;
      this.resetIndexClass();

      // 开始过渡
      this.transition(() => {
        isTransition = false;
        this.resetBannerBodyPosition();
      });
    }

    go(i) {
      if (index === i) return;

      index = i;
      this.resetIndexClass();

      // 开始过渡
      this.transition(() => {
        isTransition = false;
      });
    }

    startAutoPlay() {
      const {
        autoPlayTime
      } = this.options;

      if (!isAutoPlayStop) {
        autoPlayTimer = setTimeout(() => {
          this.next();
        }, autoPlayTime);
      }
    }

    transition(callback) {
      const {
        bannerBody,
        banners
      } = this.props,
      { transitionTime, auto } = this.options;

      isTransition = true;

      let i = index;
      // 调用easing插件，实现过渡效果
      $(bannerBody).animate({left: -banners[i].offsetLeft}, {
        easing: 'easeInOutCubic',
        duration: transitionTime,
        complete: () => {
          callback.call(this);
          if (auto && !isTransition) {
            this.startAutoPlay();
          }
        }
      });
    }

    resetBannerBodyPosition() {
      const {
        bannerBody,
        banners
      } = this.props;

      // index归位
      if (index === length - 1) {
        index = 1;
      } else if (index === 0) {
        index = length - 2;
      }

      // 重置坐标
      bannerBody.style.left = -banners[index].offsetLeft + 'px';
    }

    resetIndexClass() {
      const {
        indexs
      } = this.props;

      let i; // banner下标控制器的下标
      if (index === length - 1) i = 0;
      else if (index === 0) i = length - 3;
      else i = index - 1;

      $(indexs).attr('class', '');
      indexs[i].className = 'active';
    }
  }

  return Banner;
})(jQuery);

export default Banner;
