<template>
    <Scroll class="listview"
        v-bind:data="data"
        ref="listview"
        v-bind:listenScroll="true"
        v-bind:probeType="probeType"
        v-on:scroll="scrollTag">
        <ul>
          <li v-for="(group, index) in data" class="list-group" v-bind:key="index" v-on:="" ref="listgroup">
                <h2 class="list-group-title">{{ group.title }}</h2>
                <ul>
                    <li v-on:click="selectItem(item)" v-for="item in group.items" class="list-group-item" v-bind:key="item.id">
                        <img v-lazy="item.avatar" class="avatar" />
                        <span class="name">{{ item.name }}</span>
                    </li>
                </ul>
          </li>
        </ul>
        <div class="loading-container" v-show="!data.length">
            <loading></loading>
        </div>
        <!-- 阻止原生的冒泡和滚动 -->
        <div class="list-shortcut" v-on:touchstart="onShortcutTouchStart" v-on:touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item, i) in shortCutList" v-bind:key="i" v-bind:data-index="i" class="item" v-bind:class="{current: i === currentIndex}">{{item}}</li>
            </ul>
        </div>

        <div class="list-fixed" v-show='fixedTitle' ref="fixed">
          <h1 class="fixed-title">{{ fixedTitle }}</h1>
        </div>
    </Scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { getData } from 'common/js/dom'

const ANCHOR_HEIGHT = 18
const FIXED_HEIGHT = 30

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: 0 // 区块的上限和底部的差
    }
  },
  created() {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  computed: {
    shortCutList() {
      return this.data.map((group) => {
        return group.title.substring(0, 1)
      })
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  components: {
    Scroll,
    Loading
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight()
      }, 20)
    },
    diff(newVal) {
      let fixedTop = (newVal > 0 && newVal < FIXED_HEIGHT) ? newVal - FIXED_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
    },
    scrollY(newY) {
      const listHeight = this.listHeight
      // 当滚动到顶部 newY > 0
      if (newY > 0) {
        this.currentIndex = 0
        return
      }
      // 在中间部分滚动
      let flag = false
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]

        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          flag = true
          return
        }
      }
      if (flag) {
        return
      }
      // 滚动到底部 -newY大于最后一个元素的上限
      this.currentIndex = listHeight.length - 2
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let pos = getData(e.target, 'index')
      let firstTouch = e.touches[0] // 记录第一次的位置
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = pos
      this._scrollTo(pos)
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0] // 记录的位置
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0 // 相当于向下取整，偏移了几个锚点
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta // 记录需要滑动到的节点
      this._scrollTo(anchorIndex)
    },
    scrollTag(pos) {
      this.scrollY = pos.y
    },
    selectItem(item) {
      this.$emit('selectSinger', item)
    },
    refresh() {
      this.$refs.listview.refresh()
    },
    _scrollTo(anchorIndex) {
      if (!anchorIndex && anchorIndex !== 0) {
        return
      }
      if (anchorIndex < 0) {
        anchorIndex = 0
      } else if (anchorIndex > this.listHeight.length - 2) {
        anchorIndex = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[anchorIndex]
      this.$refs.listview.scrollToElement(this.$refs.listgroup[anchorIndex], 0)
    },
    _calculateHeight() {
      // 计算每一个的group的高度
      this.listHeight = []
      const list = this.$refs.listgroup // 获取列表所有的组
      let height = 0
      this.listHeight.push(height)

      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;

    .list-group {
        padding-bottom: 30px;

        .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }

        .list-group-item {
            display: flex;
            align-items: center;
            padding: 20px 0 0 30px;

            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }

            .name {
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
            }
        }
    }

    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;

        .item {
            padding: 3px;
            line-height: 1;
            color: $color-text-l;
            font-size: $font-size-small;

            &.current {
                color: $color-theme;
            }
        }
    }

    .list-fixed {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .fixed-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>
