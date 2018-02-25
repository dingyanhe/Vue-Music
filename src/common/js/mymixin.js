import {mapGetters} from 'vuex'

export const playListMixin = {  // 相当于将playListMixin里的代码看做初始代码，有就覆盖没有就使用
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted () { // dom ready run
    this.handlePlayList(this.playList)
  },
  activated() { // keep alive组件切换过来触发
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    handlePlayList() {
      throw new Error('compenent must implement handlePlayList method')
    }
  }
}
