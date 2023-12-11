import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

//正在播放列表
export const usePlayListStore = defineStore('playList', () => {
  const audioEle = ref(null) //引用audio元素来处理音频
  //正在播放列表
  const playList = ref([])

  const isPlaying = ref(false) //是否正在播放
  const currentIndex = ref(-1) //当前音乐索引
  const mode = ref(1) //播放模式 默认播放顺序

  const currentMusic = computed(() => {
    return playList.value[currentIndex.value] || {}
  })
  const setPlayList = (list) => {
    playList.value = list
  }

  //设置播放状态
  const setPlaying = (state) => {
    isPlaying.value = state
  }

  //设置当前播放索引
  const setCurrentIndex = (index) => {
    currentIndex.value = index
  }

  //设置Audio元素  音乐播放的核心元素
  const setAudioEle = (audio) => {
    audioEle.value = audio
    // console.log(audioEle.value)
    // console.log('设置audio元素成功!')
  }

  //设置播放模式
  const setMode = (newMode) => {
    mode.value = newMode
  }
  return {
    currentIndex,
    audioEle,
    playList,
    setPlayList,
    isPlaying,
    currentMusic,
    setPlaying,
    setCurrentIndex,
    setAudioEle,
    mode,
    setMode
  }
})
