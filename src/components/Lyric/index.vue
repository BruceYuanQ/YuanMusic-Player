<script setup>
import { usePlayListStore } from '@/stores/playlist.js'
import { storeToRefs } from 'pinia'
const playListStore = usePlayListStore()
const { currentMusic } = storeToRefs(playListStore)

import imageUrl from 'assets/img/player_cover.png'
import { computed, nextTick, onMounted, ref } from 'vue'
//歌曲封面图片
const picUrl = computed(() => {
  return currentMusic.value.id && currentMusic.value.image
    ? `${currentMusic.value.image}?params=300y300`
    : imageUrl
})

const props = defineProps({
  //歌词数据
  lyric: {
    type: Array,
    default: () => []
  },
  //是否无歌词
  nolyric: {
    type: Boolean,
    default: false
  },
  //当前歌词行数
  lyricIndex: {
    type: Number,
    default: 0
  }
})

const musicLyric = ref(null)
//计算歌词居中的top值  ！定值！
const calcTop = () => {
  const dom = musicLyric.value
  const { display = '' } = window.getComputedStyle(dom)
  if (display === 'none') {
    return
  }
  //获取容器的高度
  const height = dom.offsetHeight
  //获取中间位置的行数
  top.value = Math.floor(height / 34 / 2)
}

//创建了一个computed style属性
const lyricTop = computed(() => {
  //每行歌词34px    translate3d(0,-offset,0)垂直方向向上偏移offset
  return `transform:translate3d(0,${-34 * (props.lyricIndex - top.value)}px,0)`
})

let resizeTimer
onMounted(() => {
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => calcTop(), 60)
  })
  //dom 下一次更新完成时 调用
  nextTick(() => calcTop())
})

defineExpose({
  calcTop
})
</script>
<template>
  <div>
    <!-- 歌曲封面 -->
    <dl class="music-info">
      <dt>
        <img :src="picUrl" alt="img" />
      </dt>
      <div v-if="currentMusic.id">
        <dd>歌曲名: {{ currentMusic.name }}</dd>
        <dd>歌手名: {{ currentMusic.singer }}</dd>
        <dd>专辑名: {{ currentMusic.album }}</dd>
      </div>
      <div v-else>
        <dd>
          <a href="http://localhost:5173/music/playlist">Yuan在线音乐播放器</a>
        </dd>
      </div>
    </dl>
    <!-- 歌词部分 -->
    <div class="music-lyric" ref="musicLyric">
      <div class="music-lyric-items" :style="lyricTop">
        <p v-if="!currentMusic.id">还没有播放音乐哦~</p>
        <p v-else-if="nolyric">暂无歌词</p>
        <div v-else-if="lyric.length > 0">
          <p
            v-for="(item, index) in lyric"
            :key="index"
            :class="{ on: lyricIndex === index }"
          >
            {{ item.text }}
          </p>
        </div>
        <p v-else>歌词加载失败</p>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.music-info {
  padding-bottom: 20px;
  text-align: center;
  font-size: @font_size_medium;
  dt {
    position: relative;
    width: 186px;
    height: 186px;
    margin: 0 auto 15px;
    img {
      vertical-align: middle;
      width: 186px;
      height: 186px;
    }
    //使用 ::after 伪元素在指定位置添加一个背景图片
    &::after {
      content: '';
      position: absolute;
      left: 9px;
      top: 0;
      width: 201px;
      height: 180px;
      background: url('assets/img/album_cover_player.png') 0 0 no-repeat;
    }
  }
  dd {
    height: 30px;
    line-height: 30px;
    //显示省略号mixin.less
    .no-wrap();
  }
}
.music-lyric {
  position: absolute;
  top: 315px;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  text-align: center;
  //使用了 linear-gradient 函数，创建了一个垂直方向的线性渐变,
  //整个渐变由透明到不透明再到透明的过程
  mask-image: liner-grandient(
    to bottom,
    rgba(255, 255, 255, 0) 0,
    rgba(255, 255, 255, 0.6) 15%,
    rgba(255, 255, 255, 1) 25%,
    rgba(255, 255, 255, 1) 75%,
    rgba(255, 255, 255, 0.6) 85%,
    rgba(255, 255, 255, 0) 100%
  );
  //由于一些浏览器支持的差异，可能需要使用 -webkit-mask-image 以确保跨浏览器的兼容性。
  -webkit-mask-image: linear-gradient(
    180deg,
    hsla(0, 0%, 100%, 0) 0,
    hsla(0, 0%, 100%, 0.6) 15%,
    #fff 25%,
    #fff 75%,
    hsla(0, 0%, 100%, 0.6) 85%,
    hsla(0, 0%, 100%, 0)
  );
  .music-lyric-items {
    text-align: center;
    line-height: 34px;
    font-size: @font_size_small;
    //使用 3D 变换来创建一个新的渲染上下文
    transform: translate3d(0, 0, 0);
    //添加一个过渡效果，当 transform 属性发生变化时，过渡时间为 0.6 秒，采用 "ease-out" 缓动函数。
    transition: transform 0.6s ease-out;
    .no-wrap();
    .on {
      color: @lyric_color_active;
    }
  }
}

//当屏幕小于960px时
@media (max-width: 960px) {
  .music-info {
    display: none;
  }
  .music-lyric {
    top: 0;
    .music-lyric-items {
      font-size: @font_size_medium;
    }
  }
}
//当屏幕大于960px时
@media (min-width: 960px) {
  .pure {
    .music-info {
      display: none;
    }
    .music-lyric {
      top: 0;
      .music-lyric-items {
        // line-height: 40px;
        font-size: @font_size_medium;
      }
    }
  }
}
</style>
