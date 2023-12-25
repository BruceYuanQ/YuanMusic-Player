import { usePlayListStore } from '../stores/playlist'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const playlistStore = usePlayListStore()
const { setPlaying } = playlistStore
const { audioEle, currentMusic } = storeToRefs(playlistStore)

export const useMmPlayer = () => {
  //与播放器相关
  const musicReady = ref(false) //控制下方播放器的显示
  const currentTime = ref(0)
  const currentProgress = ref(0)

  //监听函数
  const initAudio = () => {
    //音频开始播放，当音乐开始播放时，将播放工具栏激活
    audioEle.value.onplay = () => {
      let timer
      //清除之前可能存在的同名定时器，避免冲突
      clearTimeout(timer)
      //设置新的定时器： 100毫秒后将musicReady的值设为true
      timer = setTimeout(() => {
        musicReady.value = true
      }, 100)
    }

    //当音乐暂停时
    audioEle.onpause = () => {
      setPlaying(false)
    }

    //音频缓冲时
    audioEle.value.onprogress = () => {
      try {
        if (audioEle.value.buffered.length > 0) {
          const duration = currentMusic.value.duration
          let buffered = 0 //记录已经缓冲的时长
          buffered =
            //谁小取谁
            audioEle.value.buffered.end(0) > duration
              ? duration
              : audioEle.value.buffered.end(0) //已缓冲的音频的第一个时间范围的结束时间。
          //更新进度条
          currentProgress.value = buffered / duration
        }
      } catch (e) {
        console.log(e)
      }
    }

    //播放时间递增
    audioEle.value.ontimeupdate = () => {
      currentTime.value = audioEle.value.currentTime
    }

    //将能够播放的音乐加入到播放历史列表中
    audioEle.value.oncanplay = () => {
      // addHistoryMusic(currentMusic.value)
    }
  }
  return {
    musicReady,
    currentTime,
    currentMusic,
    currentProgress,
    initAudio
  }
}
