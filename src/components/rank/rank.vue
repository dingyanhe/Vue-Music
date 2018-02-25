<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" :data="topList" ref="toplist">
      <ul>
        <li class="item" v-for="(item, index) in topList" :key="index" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(songs, i) in item.songList" :key="i">
              <span>{{i + 1}}</span>
              <span>{{songs.songname}}-{{songs.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!(topList.length)">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getTopList } from 'api/rank'
import { ERR_OK } from 'api/config'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { playListMixin } from 'common/js/mymixin'
import { mapMutations } from 'vuex'

export default {
  mixins: [playListMixin],
  created() {
    setTimeout(() => {
      this._getTopList()
    }, 1000)
  },
  data() {
    return {
      topList: []
    }
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length ? '60px' : ''
      this.$refs.rank.style.bottom = bottom
      this.$refs.toplist.refresh()
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setTopList(item)
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    _getTopList() {
      getTopList().then((res) => {
        if (res.code === ERR_OK) {
          console.log(res.data.topList)
          this.topList = res.data.topList
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .toplist {
    height: 100%;
    overflow: hidden;

    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;

      &:last-child {
        padding-bottom: 20px;
      }

      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-d;
        font-size: $font-size-small;

        .song {
          no-wrap();
          line-height: 26px;
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
