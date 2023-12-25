import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

//正在播放列表
export const usePlayListStore = defineStore('playList', () => {
  const audioEle = ref(null) //引用audio元素来处理音频
  //正在播放列表
  const playList = ref([])

  const muindex = ref(0)

  const setmuIndex = () => {
    muindex.value = muindex.value + 1
  }

  const resetIndex = () => {
    muindex.value = 0
  }

  const isPlaying = ref(false) //是否正在播放
  const currentIndex = ref(-1) //当前音乐索引
  const mode = ref(1) //播放模式 默认播放顺序
  const orderList = ref([]) // 顺序播放列表

  const currentMusic = computed(() => {
    return playList.value[currentIndex.value] || {}
  })
  const setPlayList = (list) => {
    playList.value = list
    orderList.value = list
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

  // 选择播放（设置列表 + 当前音乐）
  const selectPlay = ({ list, index }) => {
    setPlayList(list)
    setCurrentIndex(index)
    setPlaying(true)
  }

  // 选择播放（插入新的音乐到列表中）
  const selectAddPlay = (music) => {
    let list = [...playList.value]
    const index = list.findIndex((item) => item.id === music.id)
    if (index !== -1) {
      setCurrentIndex(index)
    } else {
      list.unshift(music)
      setPlayList(list)
      setCurrentIndex(0)
    }
    setPlaying(true)
  }

  // 清空播放列表
  const clearPlayList = () => {
    setPlaying(false)
    setCurrentIndex(-1)
    setPlayList([])
  }

  // 删除列表歌曲
  const deletePlayListMusic = (index) => {
    let list = [...playList.value]
    list.splice(index, 1)
    let oldCurrentIndex = currentIndex.value
    if (index < oldCurrentIndex || list.length === oldCurrentIndex) {
      oldCurrentIndex--
      setCurrentIndex(oldCurrentIndex)
    }
    setPlayList(list)
    setPlaying(list.length ? true : false)
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
    setMode,
    selectPlay,
    selectAddPlay,
    clearPlayList,
    deletePlayListMusic,
    muindex,
    setmuIndex,
    resetIndex
  }
})
