<script setup>
import { RouterView } from 'vue-router'
import Elheader from 'components/Elheader/index.vue'
import { getPlayListById } from '@/api/musiclist.js'
import { usePlayListStore } from '@/stores/playlist.js'
import { nextTick, onMounted, ref } from 'vue'

const usePlayList = usePlayListStore()

//初始化歌单方法
const initPlayList = async () => {
  const playList = await getPlayListById(3778678)
  const list = playList.tracks.slice(0, 100)
  usePlayList.setPlayList(list)
}
//将响应式引用yuanPlayer初始化为null
const yuanPlayer = ref(null)

onMounted(() => {
  //初始化播放列表
  initPlayList()

  //在下一个DOM更新周期中，设置audio元素
  nextTick(() => {
    //传递音乐播放器的dom元素
    usePlayList.setAudioEle(yuanPlayer.value)
  })
})
</script>

<template>
  <Elheader />
  <router-view></router-view>
  <!-- 播放器 -->
  <audio ref="yuanPlayer"></audio>
</template>

<style lang="less" scoped>
#app {
  position: relative;
  width: 100%;
  height: 100%;
  color: @text_color;
  font-size: @font_size_medium;
  audio {
    position: fixed;
  }
}
</style>
