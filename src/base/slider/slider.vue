<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" v-bind:key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 1500
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  mounted() {
    // DOM准备好之后使用
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)
    window.addEventListener('resize', () => {
      // 这里为什么不能使用匿名函数，因为匿名函数会存在一个this指针丢失
      if (!this.slider) {
        return
      }
      this._setSliderWidth(true)
      this.slider.refresh()
    })
  },
  methods: {
    _setSliderWidth(isResize) {
      // 设置横向滚动的宽度

      console.log('---------_setSliderWidth----------')
      // console.log(this.$refs.sliderGroup)
      // console.log(this.$refs.sliderGroup.childNodes)
      // this.children = this.$refs.sliderGroup.children // 5个子元素的document对象
      this.children = this.$refs.sliderGroup.childNodes // 5个子元素的document对象
      let singleWidth = 0
      console.log(this.$refs.slider)
      console.log(this.$refs.slider.clientWidth)
      let sliderWidth = this.$refs.slider.clientWidth
      for (let item of this.children) {
        addClass(item, 'slider-item')
        item.style.width = sliderWidth + 'px'
        singleWidth += sliderWidth
      }

      if (this.loop && !isResize) {
        singleWidth += 2 * sliderWidth
      }

      this.$refs.sliderGroup.style.width = singleWidth + 'px'
      console.log('---------_setSliderWidth----------')
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      // 创建横向滚动对象
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 1500
        },
        click: true // 移动端点击可能会出问题
      })

      this.slider.on('scrollEnd', () => {
        let pageIndex = this.slider.getCurrentPage().pageX
        if (this.loop) {
          pageIndex -= 1
        }
        this.currentPageIndex = pageIndex

        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1

      if (this.loop) {
        pageIndex += 1
      }

      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.slider {
  min-height: 1px;

  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;

      a {
        display: block;
        width: 100%;
        overflow: hidden;
        text-decoration: none;
      }

      img {
        display: block;
        width: 100%;
      }
    }
  }

  .dots {
    position: absolute;
    right: 0;
    left: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;

    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;

      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>