import { usePlayListStore } from '../stores/playlist'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const playlistStore = usePlayListStore()
const { setPlaying } = playlistStore
const { audioEle, currentMusic } = storeToRefs(playlistStore)

export const useMmPlayer = () => {
  //与播放器相关
  const musicReady = ref(false)
  const currentTime = ref(0)
  const currentProgress = ref(0)
  const initAudio = () => {
    //音频开始播放
    audioEle.value.onplay = () => {
      let timer
      //清除之前可能存在的同名定时器，避免冲突
      clearTimeout(timer)
      //设置新的定时器： 100毫秒后将musicReady的值设为true
      timer = setTimeout(() => {
        musicReady.value = true
      }, 100)
    }

    audioEle.onpause = () => {
      setPlaying(false)
    }
  }
  return { musicReady, currentTime, currentMusic, currentProgress, initAudio }
}
