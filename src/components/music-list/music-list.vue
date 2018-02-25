<template>
  <div class="music-list">
    <div class="back" v-on:click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" v-bind:style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-on:click="randomPlayF" v-show="songs.length > 0" ref="playBtn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll v-on:scroll="scroll" v-bind:probe-type="probeType" v-bind:listen-scroll="listenScroll" v-bind:data="songs" class="list" ref="list">
      <div class="song-list-wrapper">
        <song-list-me :rank="rank" v-on:select="selectItem" v-bind:songs="songs"></song-list-me>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import SongListMe from 'base/song-list/song-list-me'
  import Loading from 'base/loading/loading'
  import { mapActions } from 'vuex'
  import {playListMixin} from 'common/js/mymixin'

  const RESER_HEIGHT = 40

  export default {
    mixins: [ playListMixin ], // 相当于将playListMixin里的代码看做初始代码，有就覆盖没有就使用
    props: {
      bgImage: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      rank: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scrollY: 0
      }
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImage})`
      }
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight
      this.minTranslateY = -this.imageHeight + RESER_HEIGHT
      this.$refs.list.$el.style.top = `${this.imageHeight}px`
    },
    components: {
      Scroll,
      SongListMe,
      Loading
    },
    watch: {
      scrollY(newVal) {
        let tranlateY = Math.max(this.minTranslateY, newVal)
        let zIndex = 0 // 上拉
        let scale = 1 // 下拉放大
        let blur = 0

        const percent = Math.abs(newVal / this.imageHeight)
        if (newVal > 0) {
          zIndex = 10
          scale = 1 + percent
        } else {
          blur = Math.min(20 * percent, 20) // 最大20
        }

        this.$refs.layer.style['transform'] = `translate3d(0, ${tranlateY}px, 0)`
        this.$refs.layer.style['webkitTransform'] = `translate3d(0, ${tranlateY}px, 0)`

        let refBgImageStyle = this.$refs.bgImage.style
        let refPlayBtnStyle = this.$refs.playBtn.style
        if (newVal < this.minTranslateY) { // 滑动到顶部
          zIndex = 10
          refBgImageStyle.paddingTop = 0
          refBgImageStyle.height = `${RESER_HEIGHT}px`
          refPlayBtnStyle['display'] = 'none'
        } else {
          refBgImageStyle.paddingTop = '70%'
          refBgImageStyle.height = 0
          refPlayBtnStyle['display'] = ''
        }
        refBgImageStyle.zIndex = zIndex
        refBgImageStyle['transform'] = `scale(${scale})`
        refBgImageStyle['webkitTransform'] = `scale(${scale})`

        // 高斯模糊ios系统可以看到
        let refFilerStyle = this.$refs.filter.style
        refFilerStyle['backdrop-filter'] = `blur(${blur}px)`
        refFilerStyle['webkitBackdrop-filter'] = `blur(${blur}px)`
      }
    },
    methods: {
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.list.$el.style.bottom = bottom
        this.$refs.list.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      back() {
        this.$router.back()
      },
      selectItem(song, currentIndex) {
        this.selectPlay({
          list: this.songs,
          index: currentIndex
        })
      },
      randomPlayF() {
        console.log(this.songs)
        this.randomPlay({
          list: this.songs
        })
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    .song-list-wrapper {
      padding: 20px 30px;
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
