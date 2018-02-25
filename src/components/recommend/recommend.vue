<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" v-bind:data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <slider>
            <div v-for="item in recommends" v-bind:key="item.id">
              <a v-bind:href="item.linkUrl">
                <img v-on:load="loadImg" v-bind:src="item.picUrl" alt="" />
              </a>
            </div>
          </slider>
        </div>
        <div v-else class="slider-load">
          正在加载中...
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-on:click="selectItem(item)" class="item" v-for="item in discList" v-bind:key="item.dissid">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMixin } from 'common/js/mymixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  created() {
    // setTimeout(() => {
    this._getRecommend()
    // }, 2000)
    // setTimeout(() => {
    this._getDiscList()
    // }, 1000)
  },
  data() {
    return {
      recommends: [],
      discList: []
    }
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.scroll.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.dissid}`
      })
      this.setDisc(item)
    },
    loadImg() {
      if (!this.checkLoaded) {
        this.$refs.scroll.refresh()
        this.checkLoaded = true
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    }),
    // 获取数据 --- 轮播图
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          console.log('------------recommend------------')
          console.log(res.data.slider)
          this.recommends = res.data.slider
          console.log('------------recommend------------')
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          console.log('------------getDiscList------------')
          console.log(res.data)
          this.discList = res.data.list
          console.log('------------getDiscList------------')
        }
      })
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .slider-load {
      font-size: 12px;
      padding: 2em;
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
