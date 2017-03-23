/**********************************************************
* banner轮播插件
* 1、自动初始化视图
* 2、实现无缝轮播
* 3、实现多次跳转
* 4、实现坐标直接过渡
*
* 注意：由于是无缝轮播，在头部和尾部各多加了张图片
**********************************************************/

(($) => {
    // 私有变量
    let mainTimer = null,
        transitionTimer = null,
        bannerIndex = 1,
        bannerLength = null,
        isGoing = false;

    class Banner {
        constructor(selector, options) {
            // 參数
            this.options = {
                showIndexs: true,
                showControl: true,
                time: 2000,
                auto: false,
                transitionTime: 100
            };

            // 获取banner节点和宽度
            const banner = document.querySelector(selector),
                  width = banner.clientWidth;

            // 设置全局常量
            this.props = {
                banner,
                width
            };

            // 设置全局变量
            this.states = {
                index: 0,
                isStop: false,
                isTransition: false,
                nowDirec: -1
            };

            // 合并自定义參数
            if (options) {
                $.extend(this.options, options);
            }
        }

        initView() {
            const {
                banner,
                width
            } = this.props;
            let {
                index
            } = this.states;

            let bannerBody = banner.querySelector('.bd'),
                banners = bannerBody.querySelectorAll('.banner_item'),
                length = this.props.length = banners.length; // 设置banner长度

            bannerLength = length + 2; // 初始化实际长度

            // 添加坐标控制器对象
            if (this.options.showIndexs) {
                const indexsBody = document.createElement('div');
                indexsBody.className = 'index_bd';
                // 兼容IE8，使用动态添加marginLeft实现居中
                indexsBody.style.marginLeft = -(20 * length + 10) / 2 + 'px';

                let indexs = '';
                for (let i = 0; i < length; i++) {
                    if (i == index) {
                        indexs += '<a href="javascript:void(0)" class="active">' + i + '</a>';
                    } else {
                        indexs += '<a href="javascript:void(0)">' + i + '</a>';
                    }
                }

                indexsBody.innerHTML = indexs;
                banner.appendChild(indexsBody);
            }

            // 添加左右切换控制器对象
            if (this.options.showControl) {
                const controlBody = '<div class="control_bd">' +
                                    '<a href="javascript:void(0)" class="prev"></a>' +
                                    '<a href="javascript:void(0)" class="next"></a>' +
                                    '</div>';
                banner.innerHTML += controlBody;
            }

            // banner子节点数量改变重新获取子节点
            bannerBody = this.props.bannerBody = banner.querySelector('.bd');
            this.props.indexsBody = banner.querySelector('.index_bd');
            this.props.indexs = banner.querySelectorAll('.index_bd a');
            this.props.prevBtn = banner.querySelector('.prev');
            this.props.nextBtn = banner.querySelector('.next');

            // 首尾各添加一个节点，实现无缝连接
            bannerBody.style.width = width * bannerLength + 'px';
            bannerBody.insertBefore(banners[banners.length - 1].cloneNode(), bannerBody.childNodes[0]);
            bannerBody.appendChild(banners[0].cloneNode());
            bannerBody.style.left = -width + 'px';
        }

        initListener() {
            const {
                banner,
                prevBtn,
                nextBtn,
                indexs
            } = this.props, {
                auto
            } = this.options;

            // 鼠标浮动监听
            banner.onmouseenter = () => {
                if (!this.states.isStop) {
                    this.states.isStop = true;
                    if (auto && !this.states.isTransition) {
                      clearTimeout(mainTimer);
                    }
                }
            };
            banner.onmouseleave = () => {
                if (this.states.isStop) {
                    this.states.isStop = false;
                    // 防止重复自动轮播定时器重复
                    if (auto && !this.states.isTransition) {
                      clearTimeout(mainTimer);
                      this.main();
                    }
                }
            };

            // 左右切换监听
            prevBtn.onclick = () => {
                this.prev();
            };
            nextBtn.onclick = () => {
                this.next();
            };

            // 坐标控制器监听
            $.each(indexs, (i, e) => {
              e.onclick = () => {
                this.go(i);
              };
            });
        }

        go(index) {
          const {
            width,
            bannerBody
          } = this.props;

          let prevIndex = this.states.index,
              nowBannerClone = bannerBody.children[bannerIndex].cloneNode(true),
              direc;

          if (prevIndex === index) return; // 重复直接跳出

          isGoing = true; // 设置跳转状态

          this.states.index = index;
          bannerIndex = index + 1;

          // 改变坐标控制器
          this.changeIndexClass(prevIndex, index);

          // 判断跳转位置，相对于当前坐标的位置方向
          // 重新设置位置，实现直接过渡，无需跳转多个图片
          if (prevIndex < index) {
            bannerBody.style.left = -width * (bannerIndex - 1) + 'px';
            nowBannerClone.className += ' cloneNode';
            nowBannerClone.style.position = 'absolute';
            nowBannerClone.style.top = 0;
            nowBannerClone.style.left = width * (bannerIndex - 1)  + 'px';
            bannerBody.appendChild(nowBannerClone);
            direc = -1;
          } else if (prevIndex > index) {
            bannerBody.style.left = -width * (bannerIndex + 1) + 'px';
            nowBannerClone.className += ' cloneNode';
            nowBannerClone.style.position = 'absolute';
            nowBannerClone.style.top = 0;
            nowBannerClone.style.left = width * (bannerIndex + 1)  + 'px';
            bannerBody.appendChild(nowBannerClone);
            direc = 1;
          }

          // 位置设定完毕开始过渡
          this.transition(direc, () => {
            bannerBody.removeChild(nowBannerClone);
            isGoing = false;
          });
        }

        prev() {
          const {
              length,
              bannerBody,
              width
          } = this.props;

          let prevIndex = this.states.index;

          var prev = () => {

            bannerIndex--; // // 实际下表减少，过渡结束后再纠正

            // 判断是否为第一个，第一个跳到最后个
            if (this.states.index > 0) {
              this.states.index--;
            } else {
              this.states.index = length - 1;
            }

            // 改变坐标控制器
            this.changeIndexClass(prevIndex, this.states.index);

            // 开始向左过渡
            this.transition(1, () => {
              if (bannerIndex === 0) {
                bannerIndex = bannerLength - 2;
                bannerBody.style.left = -width * bannerIndex + 'px';
              }
            }, 350);
          };

          // 正在过渡时直接重置再过渡
          if (this.states.isTransition) {
            if (this.states.nowDirec === -1) { // 判断是否正正往相反方向运动
              // 关闭定时器
              clearTimeout(transitionTimer);
              this.states.isTransition = false;
              this.clearCloneNode();
              prev();
            } else {
              // this.reset(bannerIndex, () => {
              //   if (bannerIndex === 0) {
              //     bannerIndex = bannerLength - 2;
              //     bannerBody.style.left = -width * bannerIndex + 'px';
              //   }
              //   prev();
              // }, 1);
              clearTimeout(transitionTimer);
              this.states.isTransition = false;
              this.clearCloneNode();
              prev();
            }
          } else {
            prev();
          }
        }

        next() {
          const {
              length,
              bannerBody,
              width
          } = this.props;

          let prevIndex = this.states.index;

          var next = () => {

            bannerIndex++; // 实际下表增加，过渡结束后再纠正

            // 判断是否为最后个，最后个跳回第一个
            if (this.states.index < length - 1) {
              this.states.index++;
            } else {
              this.states.index = 0;
            }

            // 改变坐标控制器
            this.changeIndexClass(prevIndex, this.states.index);

            // 开始向右过渡
            this.transition(-1, () => {
              // 重置位置
              if (bannerIndex === bannerLength - 1) {
                bannerIndex = 1;
                bannerBody.style.left = -width + 'px';
              }
            }, 350);
          };

          // 正在过渡时直接重置再过渡
          if (this.states.isTransition) {
            if (this.states.nowDirec === 1) { // 判断是否正正往相反方向运动
              // 关闭定时器
              clearTimeout(transitionTimer);
              this.states.isTransition = false;
              this.clearCloneNode();
              next();
            } else {
              // 往相同方向先重置再开始
              // this.reset(bannerIndex, () => {
              //   if (bannerIndex === bannerLength - 1) {
              //     bannerIndex = 1;
              //     bannerBody.style.left = -width + 'px';
              //   }
              //   next();
              // }, -1);
              clearTimeout(transitionTimer);
              this.states.isTransition = false;
              this.clearCloneNode();
              next();
            }
          } else {
            next();
          }
        }

        clearCloneNode() {
          let {bannerBody} = this.props;

          const cloneNodes = bannerBody.querySelectorAll('.cloneNode');
          for (let i = 0; i < cloneNodes.length; i++) bannerBody.removeChild(cloneNodes[i]);
        }

        reset(index, callback, direc) {
          const {
            bannerBody,
          } = this.props;

          // 关闭定时器
          clearTimeout(transitionTimer);
          this.states.isTransition = false;

          // 清空所有banner的绝对定位
          // $(bannerBody.children).css({
          //   position: '',
          //   left: '',
          //   top: ''
          // });

          // 重置bannerBody的位置
          this.transition(direc, () => {
            this.clearCloneNode();
            callback.call(this);
          }, 30);
        }

        main() {
            const {
                length,
                bannerBody,
                width
            } = this.props, {
                time
            } = this.options;

            let prevIndex = this.states.index;

            if (!this.states.isStop) {
              mainTimer = setTimeout(() => {
                  this.states.isTransition = true;
                  this.states.nowDirec = -1;

                  bannerIndex++;

                  if (this.states.index < length - 1) {
                    this.states.index++;
                  } else {
                    this.states.index = 0;
                  }

                  this.changeIndexClass(prevIndex, this.states.index);

                  this.transition(-1, () => {
                    // 重置位置
                    if (bannerIndex === bannerLength - 1) {
                      bannerIndex = 1;
                      bannerBody.style.left = -width + 'px';
                    }
                  }, 350);
              }, time);
            }
        }

        changeIndexClass(prevIndex, index) {
          const { indexsBody } = this.props;

          indexsBody.children[prevIndex].className = '';
          indexsBody.children[index].className = 'active';
        }

        transition(direc, callback, transitionTime) {
            const {
                bannerBody,
                width
            } = this.props, {
                auto
            } = this.options;

            if (!transitionTime) transitionTime = 350;

            if (bannerIndex * -width < bannerBody.offsetLeft) {
              direc = -1;
            } else {
              direc = 1;
            }

            let spead = (bannerIndex * -width - bannerBody.offsetLeft) / transitionTime, // 确定运动方向和速度
                frames = 1;

            // 跳出过渡，重置位置，重置參数，执行回调和方法
            const outTimer = () => {
              bannerBody.style.left = bannerIndex * -width + 'px';

              this.states.isTransition = false;
              clearTimeout(transitionTimer);

              callback.call(this);

              if (auto && !this.states.isStop) {
                this.main();
              }
            };

            // 设置定时器
            const setTimer = () => {
              transitionTimer = setTimeout(() => {
                bannerBody.style.left = bannerBody.offsetLeft + spead * frames + 'px';
                //
                if (bannerBody.offsetLeft <= (bannerLength - 1) * -width) bannerBody.style.left = -width;
                if (bannerBody.offsetLeft >= 0) bannerBody.style.left = (bannerLength - 2) * -width;

                if (bannerBody.offsetLeft <= bannerIndex * -width && direc < 0) {   //右过渡结束判断
                  //offsetLeft -= width;
                  // 判断是否为最后个，由于为了实现无缝轮播，在尾部多加个张图片，所以在过渡结束后
                  // 需要跳到真实的第一张
                  //if (offsetLeft <= (length + 1) * -width) offsetLeft = -width;

                  outTimer();
                } else if (bannerBody.offsetLeft >= bannerIndex * -width && direc > 0) {  //左过渡结束判断
                  //offsetLeft += width;
                  // 判断是否为第一个，由于为了实现无缝轮播，在头部多加个张图片，所以在过渡结束后
                  // 需要跳到真实的最后张
                  //if (offsetLeft >= 0) offsetLeft = -width * (length);

                  outTimer();
                } else {
                  setTimer(); // 回调实现循环
                }
              }, frames);
            };

            // 开始过渡定时器
            this.states.isTransition = true;
            this.states.nowDirec = direc;
            setTimer();
        }

        start() {
            const {
                auto
            } = this.options;

            // 开启自动轮播
            if (auto) {
                this.main();
            }
        }
    }

    const b = new Banner('.banner');
    b.initView();
    b.initListener();
    b.start();
})(jQuery);
