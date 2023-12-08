<script setup>
import MusicBtn from 'components/MusicBtn/index.vue'
import Lyric from 'components/Lyric/index.vue'
import yuanProgress from '@/base/electroProgress/index.vue'
import volume from '@/components/volume/index.vue'
import { usePlayListStore } from '../stores/playlist'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, watch } from 'vue'
import { silencePromise } from '@/utils/util.js'

import { useMmPlayer } from '@/composabeles/player.js'

//与播放器进度相关的变量和函数
const { musicReady, initAudio } = useMmPlayer()

//引入store中的变量和函数
const playListStore = usePlayListStore()
const { isPlaying, audioEle, currentMusic } = storeToRefs(playListStore)

onMounted(() => {
  //初始化音频播放器
  initAudio()
  //播放结束事件
  audioEle.value.onended = () => {}
})

//切换歌曲
watch(currentMusic, (newMusic, oldMusic) => {
  if (!newMusic.id) {
    console.log(1)
  }
  if (newMusic.id === oldMusic.id) {
    return
  }
  audioEle.value.src = newMusic.url
  silencePromise(audioEle.value.play())
})

//播放 或 暂停
watch(isPlaying, (newPlaying) => {
  const audio = audioEle.value
  nextTick(() => {
    newPlaying ? silencePromise(audio.play()) : audio.pause()
    musicReady.value = true
  })
})
</script>
<template>
  <div class="music flex-col">
    <!-- 上方主体内容 -->
    <div class="music-content">
      <!-- 左方歌曲列表显示 -->
      <div class="music-left flex-col">
        <MusicBtn></MusicBtn>
        <RouterView class="router-view"></RouterView>
      </div>
      <!-- 右方歌词显示 -->
      <div class="music-right">
        <Lyric></Lyric>
      </div>
    </div>

    <!-- 下方播放器 -->
    <div class="music-bar">
      <!-- 上一曲 播放/暂停 下一曲 -->
      <div class="music-bar-btns">
        <ElectroIcon
          type="prev"
          :size="24"
          class="pointer"
          title="上一曲 Ctrl + Left"
        ></ElectroIcon>
        <div class="control-play pointer" title="播放暂停 Space">
          <ElectroIcon
            :type="false ? 'pause-bold' : 'play-bold'"
            :size="20"
          ></ElectroIcon>
        </div>
        <ElectroIcon
          type="next"
          :size="24"
          class="pointer"
          title="下一曲 Ctrl + Right"
        ></ElectroIcon>
      </div>

      <!-- 播放音乐信息 音乐播放进度条 -->
      <div class="music-music">
        <!-- 播放音乐信息 -->
        <div><div>欢迎使用Yuan在线音乐播放器</div></div>
        <!-- 音乐播放进度条 -->
        <div>
          <yuanProgress></yuanProgress>
        </div>
      </div>

      <!-- 播放顺序 评论 纯净模式 音量 -->
      <div class="options">
        <!-- 播放顺序 -->
        <ElectroIcon type="oneloop pointer mode" :size="24"></ElectroIcon>

        <!-- 评论 -->
        <ElectroIcon type="comment" :size="24"></ElectroIcon>

        <!-- 纯净模式 -->
        <ElectroIcon
          type="pureclose pointer pure-mode"
          :size="28"
        ></ElectroIcon>

        <!-- 音量 -->
        <div>
          <volume></volume>
        </div>
      </div>
    </div>

    <!--遮罩 背景滤镜 -->
    <div class="electroPlayer-bg"></div>
    <div class="electroplayer-mask"></div>
  </div>
</template>
<style lang="less" scoped>
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
    //弹性项的扩展比例
    // flex: 1;
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
    }

    .music-music {
      position: relative;
      width: 100%;
      flex: 1;
      box-sizing: border-box;
      font-size: @font_size_small;
      color: @text_color_active;
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
}
</style>
