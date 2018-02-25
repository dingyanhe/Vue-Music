<template>
  <div id="app">
    <m-header></m-header>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <Player></Player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

#app {
  color: $color-theme;
}
</style>
