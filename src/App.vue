<script setup>
import { RouterView } from 'vue-router'
import Elheader from 'components/Elheader/index.vue'
import { getPlayListById } from '@/api/musiclist.js'
import { usePlayListStore } from '@/stores/playlist.js'
import { onMounted } from 'vue'

const usePlayList = usePlayListStore()

//初始化歌单方法
const initPlayList = async () => {
  const playList = await getPlayListById(3778678)
  const list = playList.tracks.slice(0, 100)
  usePlayList.setPlayList(list)
}

onMounted(() => {
  initPlayList()
})
</script>

<template>
  <Elheader />
  <router-view></router-view>
</template>

<style lang="less" scoped>
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: @text_color;
  font-size: @font_size_medium;
}
</style>
