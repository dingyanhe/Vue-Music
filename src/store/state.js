// import {playMode} from 'common/js/config'
// import {loadSearch, loadPlay, loadFavorite} from 'common/js/cache'

// const state = {
//   singer: {},
//   playing: false,
//   fullScreen: false,
//   playlist: [],
//   sequenceList: [],
//   mode: playMode.sequence,
//   currentIndex: -1,
//   disc: {},
//   topList: {},
//   searchHistory: loadSearch(),
//   playHistory: loadPlay(),
//   favoriteList: loadFavorite()
// }

// export default state
import { playMode } from 'common/js/config'

const state = {
  singer: {}, // 歌手信息
  playing: false,
  fullScreen: false,
  playList: [], // 播放列表
  sequenceList: [], // 播放模式选择的区别
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放的歌曲索引
  disc: {},
  topList: {},
  searchHistory: []
}

export default state
