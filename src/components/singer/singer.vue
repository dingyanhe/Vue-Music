<template>
  <div class="singer" ref="singer">
    <singerList v-on:selectSinger="selectWho" v-bind:data="singers" ref="singerList"></singerList>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import singerList from 'base/listview/singerlist'
import { mapMutations } from 'vuex'
import {playListMixin} from 'common/js/mymixin'

const HOT_NAME = '热门'
const HOT_NUMBER = 10

export default {
  mixins: [playListMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.singerList.refresh()
    },
    selectWho(singer) {
      console.log(singer)
      this.$router.push({
        path: `/singer/${singer.singerId}`
      })
      this.setSinger(singer)
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list)
        }
      })
    },
    _normalizeSinger(list) {
      // 用来处理数据
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      }
      list.forEach(function(item, i) {
        if (i < HOT_NUMBER) {
          // 处理热门
          map.hot.items.push(new Singer({
            id: item.Fsinger_id,
            name: item.Fsinger_name,
            singerId: item.Fsinger_mid
          }))
        }

        // 处理其他字母
        const key = item.Findex

        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          }
        }
        map[key].items.push(new Singer({
          id: item.Fsinger_id,
          name: item.Fsinger_name,
          singerId: item.Fsinger_mid
        }))
      }, this)

      let hot = []
      let rest = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z0-9]/)) {
          rest.push(val)
        } else {
          hot.push(val)
        }
      }

      rest.sort((a, b) => {
        return a.title.codePointAt(0) - b.title.codePointAt(0)
        // return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(rest)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    singerList
  }
}
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
