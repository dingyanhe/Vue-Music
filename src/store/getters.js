// export const singer = state => state.singer

// export const playing = state => state.playing

// export const fullScreen = state => state.fullScreen

// export const playlist = state => state.playlist

// export const sequenceList = state => state.sequenceList

// export const mode = state => state.mode

// export const currentIndex = state => state.currentIndex

// export const currentSong = (state) => {
//   return state.playlist[state.currentIndex] || {}
// }

// export const disc = state => state.disc

// export const topList = state => state.topList

// export const searchHistory = state => state.searchHistory

// export const playHistory = state => state.playHistory

// export const favoriteList = state => state.favoriteList

export const singer = state => state.singer

// 播放器
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
// 充当计算属性
export const currentSong = (state) => {
  return state.playList[state.currentIndex] || {}
}
export const disc = state => state.disc
export const topList = state => state.topList
export const searchHistory = state => state.searchHistory
