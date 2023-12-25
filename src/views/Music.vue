<script setup>
import MusicBtn from 'components/MusicBtn/index.vue'
import Lyric from 'components/Lyric/index.vue'
import yuanProgress from '@/base/electroProgress/index.vue'
import Volume from '@/components/volume/index.vue'
import { usePlayListStore } from '../stores/playlist'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, watch, computed, ref } from 'vue'
import { silencePromise, formatSecond, parseLyric } from '@/utils/util.js'
import { PLAY_MODE } from '@/config.js'
import { showToast } from '../base/electroToast'

import { useMmPlayer } from '@/composabeles/player.js'
import { useRouter } from 'vue-router'
const router = useRouter()

//与播放器进度相关的变量和函数
const { musicReady, initAudio, currentTime, currentProgress } = useMmPlayer()

//引入store中的变量和函数
const playListStore = usePlayListStore()
const { setCurrentIndex, setPlaying, setMode, setmuIndex, resetIndex } =
  playListStore
const {
  isPlaying,
  audioEle,
  currentMusic,
  playList,
  currentIndex,
  mode,
  muindex
} = storeToRefs(playListStore)

onMounted(() => {
  //监听音频播放器
  initAudio()

  //播放结束事件
  audioEle.value.onended = () => {
    if (mode.value === PLAY_MODE.ONE_LOOP) {
      loop()
    } else {
      next()
    }
  }

  //音乐播放出错
  audioEle.value.onerror = () => {
    let alertMsg = '当前音乐不可播放，已自动播放下一首'
    if (playList.value.length === 1) {
      alertMsg = '暂时没有可以播放的音乐哦'
    }
    showToast({ mesage: alertMsg })
    next()
  }
})

//切换歌曲
watch(currentMusic, (newMusic, oldMusic) => {
  if (!newMusic.id) {
    return
  }
  if (newMusic.id === oldMusic.id) {
    return
  }
  audioEle.value.src = newMusic.url
  //重置相关参数
  lyricIndex.value = currentTime.value = currentProgress.value = 0
  silencePromise(audioEle.value.play())
  getMusicLyric(newMusic.id)
})

//播放 或 暂停
watch(isPlaying, (newPlaying) => {
  const audio = audioEle.value
  nextTick(() => {
    newPlaying ? silencePromise(audio.play()) : audio.pause()
    //更新 musicReady 的值为 true
    musicReady.value = true
  })
})

//上一首
const prev = function () {
  if (!musicReady.value) {
    return
  }
  if (playList.value.length === 1) {
    loop()
  } else {
    let index = currentIndex.value - 1
    if (index < 0) {
      index = playList.value.length - 1
    }
    setmuIndex()
    if (!isPlaying.value && musicReady.value) {
      setPlaying(true)
    }
    //表示音乐不再处于准备好的状态，正在加载新的歌曲。新的歌曲加载完成后，更新 musicReady 的值为 true
    musicReady.value = false
  }
}

//播放暂停
const play = () => {
  if (!musicReady.value) {
    return
  }
  setPlaying(!isPlaying.value)
}

//下一首
const next = () => {
  if (muindex.value === 6) {
    console.log(11)
    musicReady.value = false
    setPlaying(false)
    alert('广告时间')
    musicReady.value = true
    resetIndex
  }
  if (!musicReady.value) {
    return
  }
  const length = playList.value.length
  if (length === 1) {
    loop()
  } else {
    let index = currentIndex.value + 1
    setmuIndex()
    if (index === length) {
      index = 0
    }
    if (!isPlaying.value && musicReady.value) {
      setPlaying(true)
    }
    setCurrentIndex(index)
    musicReady.value = false
  }
}

//播放进度百分比
const percentMusic = computed(() => {
  const duration = currentMusic.value.duration
  return currentTime.value && duration ? currentTime.value / duration : 0
})

//音乐播放时长显示
const progressMusic = (percent) => {
  currentTime.value = currentMusic.value.duration * percent
}

//音乐播放进度更新
const progressMusicEnd = (percent) => {
  //currentTime不是响应的，所以不用currentTime
  audioEle.value.currentTime = currentMusic.value.duration * percent
}

//切换播放顺序
const modeChange = () => {
  const newMode = (mode.value + 1) % 4
  setMode(newMode)
}

//获取播放模式icon
const getModeType = computed(() => {
  return {
    //LIST_LOOP: 0  <config.js>
    //当 mode.value 等于 PLAY_MODE.LIST_LOOP 时，返回 "listloop"
    [PLAY_MODE.LIST_LOOP]: 'listloop',
    [PLAY_MODE.ORDER]: 'order',
    [PLAY_MODE.RANDOM]: 'random',
    [PLAY_MODE.ONE_LOOP]: 'oneloop'
  }[mode.value]
})

//获取播放模式title
const getModeTitle = computed(() => {
  const key = 'Ctrl + 0'
  return (
    {
      [PLAY_MODE.LIST_LOOP]: '列表循环',
      [PLAY_MODE.ORDER]: '顺序播放',
      [PLAY_MODE.RANDOM]: '随机播放',
      [PLAY_MODE.ONE_LOOP]: '单曲循环'
    }[mode.value] +
    ' ' +
    key
  )
})

//循环播放
const loop = () => {
  //当前曲目开始重新播放
  audioEle.value.currentTime = 0
  silencePromise(audioEle.value.play())
  setPlaying(true)
  if (Lyric.value.length > 0) {
    lyricIndex.value = 0
  }
}

//打开歌曲评论界面
const openComment = () => {
  if (!currentMusic.value.id || !musicReady.value) {
    return
  }
  router.push(`/music/comment/${currentMusic.value.id}`)
}

//歌词显示变量
const lyric = ref([])
const nolyric = ref(false)
const lyricIndex = ref(0)
const lyricVisible = ref(false)
// const lyricVisible = ref(false)

import { getLyric } from '@/api/musiclist.js'

//获取歌词
const getMusicLyric = async (id) => {
  const res = await getLyric(id)
  if (res.lrc && res.lrc.lyric) {
    nolyric.value = false
    lyric.value = parseLyric(res.lrc.lyric)
  } else {
    nolyric.value = true
  }
  silencePromise(audioEle.value.play())
}

const yuanLyric = ref(null)

//歌词滚动
watch(currentTime, (newTime, oldTime) => {
  if (nolyric.value || lyric.value.length === 0) {
    return
  }
  let start = 0
  let end = lyric.value.length - 1
  let index = lyricIndex.value
  if (newTime > oldTime) {
    start = index
  } else {
    end = index
  }
  for (let i = start; i <= end; i++) {
    if (lyric.value[i].time < newTime) {
      index = i
    }
    lyricIndex.value = index
  }
})

//纯净模式相关
const isPure = ref(false)
const openPure = () => {
  isPure.value = !isPure.value
  nextTick(() => {
    yuanLyric.value.calcTop()
  })
}
const getPureModeType = computed(() => {
  return isPure.value ? 'pureopen' : 'pureclose'
})

//关闭歌词
const handleCloseLyric = () => {
  lyricVisible.value = false
}

import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const { setVolume } = userStore

// 与播放器进度相关变量和函数
const { volume } = storeToRefs(userStore) // 音量大小
const isMute = ref(false) // 是否静音
// 音量调节
const volumeChange = (percent) => {
  isMute.value = percent === 0
  audioEle.value.volume = percent
  setVolume(percent)
}
</script>
<template>
  <div class="music flex-col">
    <!-- 上方主体内容 -->
    <div class="music-content">
      <!-- 左方歌曲列表显示 -->
      <div class="music-left flex-col">
        <MusicBtn></MusicBtn>
        <RouterView class="router-view"> </RouterView>
      </div>
      <!-- 右方歌词显示 -->
      <div class="music-right" :class="{ show: lyricVisible, pure: isPure }">
        <div class="close-lyric" @click="handleCloseLyric">关闭歌词</div>
        <Lyric
          ref="yuanLyric"
          :lyric="lyric"
          :nolyric="nolyric"
          :lyricIndex="lyricIndex"
        ></Lyric>
      </div>
    </div>

    <!-- 下方播放器 -->
    <div
      class="music-bar"
      :class="{ disabled: !musicReady || !currentMusic.id }"
    >
      <!-- 上一曲 播放/暂停 下一曲 -->
      <div class="music-bar-btns">
        <ElectroIcon
          type="prev"
          :size="24"
          class="pointer"
          title="上一曲 Ctrl + Left"
          @click="prev"
        ></ElectroIcon>
        <div class="control-play pointer" title="播放暂停 Space">
          <ElectroIcon
            :type="isPlaying ? 'pause-bold' : 'play-bold'"
            :size="20"
            @click="play"
          ></ElectroIcon>
        </div>
        <ElectroIcon
          type="next"
          :size="24"
          class="pointer"
          title="下一曲 Ctrl + Right"
          @click="next"
        ></ElectroIcon>
      </div>

      <!-- 播放音乐信息 音乐播放进度条 -->
      <div class="music-music">
        <!-- 播放音乐信息 -->
        <div class="music-bar-info">
          <div v-if="currentMusic && currentMusic.id">
            {{ currentMusic.name }}
            <span>--{{ currentMusic.singer }}</span>
          </div>
          <div v-else>欢迎使用Yuan在线音乐播放器</div>
        </div>
        <div class="music-bar-time">
          {{ formatSecond(currentTime) }}/{{
            formatSecond(currentMusic.duration % 3600)
          }}
        </div>
        <!-- 音乐播放进度条 -->
        <div>
          <yuanProgress
            :percent="percentMusic"
            :percentLoad="currentProgress"
            @percentChange="progressMusic"
            @percentChangeEnd="progressMusicEnd"
          ></yuanProgress>
        </div>
      </div>

      <!-- 播放顺序 评论 纯净模式 音量 -->
      <div class="options">
        <!-- 播放顺序 -->
        <ElectroIcon
          class="pointer mode"
          :type="getModeType"
          :title="getModeTitle"
          :size="24"
          @click="modeChange"
        ></ElectroIcon>

        <!-- 评论 -->
        <ElectroIcon
          class="pointer comment"
          type="comment"
          title="评论"
          @click="openComment"
          :size="24"
        ></ElectroIcon>

        <!-- 纯净模式 -->
        <ElectroIcon
          class="pointer pure-mode"
          @click="openPure"
          :type="getPureModeType"
          title="纯净模式"
          :size="28"
        ></ElectroIcon>

        <!-- 音量 -->
        <div class="music-bar-volumne">
          <Volume :volume="volume" @volume-change="volumeChange"></Volume>
        </div>
      </div>
    </div>

    <!--遮罩 背景滤镜 -->
    <div class="electroPlayer-bg"></div>
    <div class="electroplayer-mask"></div>
  </div>
</template>
<style lang="less" scoped>
.guanggao {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}
.router-view {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.music {
  padding: 75px 25px 25px 25px;
  width: 100%;
  max-width: 1750px;
  margin: 0 auto;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  .music-content {
    display: flex;
    // 弹性项的扩展比例,防止布局乱套
    flex: 1;
    overflow: hidden;
    width: 100%;
    .music-left {
      flex: 1;
      width: 100%;
      overflow: hidden;
    }
    .music-right {
      position: relative;
      width: 310px;
      margin-left: 10px;
      .close-lyric {
        position: absolute;
        top: 0;
        z-index: 1;
        cursor: pointer;
      }
    }
  }
  //底部player-bar
  .music-bar {
    display: flex;
    //列与列之间间隔40px
    gap: 40px;
    align-items: center;
    width: 100%;
    padding: 15px 0;
    color: #fff;

    //当元素拥有 disabled 类时的样式，将其设置为不可点击且半透明。
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
    }

    .music-bar-btns {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 180px;
      .control-play {
        .flex-center;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.3);
      }
    }

    .music-music {
      position: relative;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      font-size: @font_size_small;
      color: @text_color_active;
      .music-bar-info {
        height: 15px;
        padding-right: 80px;
        line-height: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .music-bar-time {
        position: absolute;
        top: 0;
        right: 5px;
      }
    }
    .options {
      .flex-center;
      gap: 20px;
    }
  }

  //背景滤镜配置
  .electroPlayer-bg,
  .electroplayer-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .electroplayer-mask {
    z-index: -1;
    background-color: @mask_color;
  }
  .electroPlayer-bg {
    background: url('assets/background/bg-4.jpg');
    z-index: -2;
    //禁止背景图像重复
    background-repeat: no-repeat;
    background-size: cover;
    //设置背景图像的位置为居中
    background-position: 50%;
    //对背景图像进行12像素的模糊处理
    filter: blur(12px);
    //设置元素的不透明度为 0.7，使其半透明
    opacity: 0.7;
    //应用所有属性的过渡效果，过渡时间为 0.8 秒
    transition: all 0.8s;
    //对元素进行缩放，使其比原始大小大 1.1 倍
    transform: scale(1.1);
  }

  @media (min-width: 960px) {
    .close-lyric {
      display: none;
    }
    .music-right {
      &.pure {
        display: block;
        width: 100%;
        margin-left: 0;
      }
    }
  }

  // 当屏幕小于960时，右侧歌词组件消失，纯净模式按钮消失
  @media (max-width: 960px) {
    .music-right {
      display: none;
      &.show {
        display: block;
        margin-left: 0;
        width: 100%;
      }
    }
    .pure-mode {
      display: none;
    }
  }

  @media (max-width: 768px) {
    padding: 75px 15px 5px 15px;
    .music-bar {
      padding-top: 10px;
      .music-bar-info span {
        display: none;
      }
    }
  }

  @media (max-width: 520px) {
    .music-bar {
      position: relative;
      flex-direction: column;
      gap: 0;
      .music-bar-btns {
        order: 2;
        width: 60%;
        margin-top: 10px;
      }

      .music-music {
        order: 1;
        padding-left: 0;
      }
      .mode,
      .comment {
        position: absolute;
        bottom: 23px;
        margin: 0;
      }
      .mode {
        left: 5px;
      }
      .comment {
        right: 5px;
      }
      .music-bar-volume {
        display: none;
      }
    }
  }
}
</style>
