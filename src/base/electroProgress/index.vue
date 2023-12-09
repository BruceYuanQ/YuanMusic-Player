<script setup>
import { watch, ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['percentChange', 'percentChangeEnd'])
const props = defineProps({
  //播放条进度
  percent: {
    type: [Number],
    default: 0
  },
  //缓冲条进度
  percentLoad: {
    type: [Number],
    default: 0
  }
})
//圆点的宽度
const dotWidth = 0
const move = ref({
  //是否正在拖动进度条
  isDragging: false,
  //记录拖动开始时的水平座标
  startX: 0,
  //记录拖动过程中圆点的左侧位置
  left: 0
})

const yuanProgress = ref(null)
const yuanProgressLoad = ref(null)
const yuanProgressPlay = ref(null)

onMounted(() => {
  bindEvents()
})

onUnmounted(() => {
  unbindEvents()
})

//绑定鼠标事件
const bindEvents = () => {
  document.addEventListener('mousemove', barMove)
  document.addEventListener('mouseup', barUp)
}

//解绑鼠标事件
const unbindEvents = () => {
  document.removeEventListener('mousemove', barMove)
  document.removeEventListener('mouseup', barUp)
}

//() => props.percent 追踪函数依赖关系 监听函数返回值
//而 props.persent 不可以
//播放进度条跟新
watch(
  () => props.percent,
  (newPercent) => {
    if (newPercent >= 0 && !move.value.isDragging) {
      //总宽度
      const innerWidth = yuanProgress.value.clientWidth - dotWidth
      //播放条宽度=总宽度*百分比
      const offsetWidth = newPercent * innerWidth
      moveSlide(offsetWidth)
    }
  }
)

//移动进度条圆点
const moveSlide = (offsetWidth) => {
  //操作dom
  yuanProgressPlay.value.style.width = offsetWidth + 'px'
}

//缓冲进度条跟新
watch(
  () => props.percentLoad,
  (newPersentLoad) => {
    const innerWidth = yuanProgress.value.clientWidth - dotWidth
    const offsetWidth = newPersentLoad * innerWidth
    yuanProgressLoad.value.style.width = offsetWidth + 'px'
  }
)

//鼠标点击事件
const barClick = (e) => {
  //获取播放进度条的信息
  const rect = yuanProgressPlay.value.getBoundingClientRect()
  //播放条宽度 和 鼠标点击相对进度条左侧偏移量 之间取最小值 确保不会超过播放进度条的右侧
  //鼠标点击点相对于播放进度条元素左侧的偏移量，确保该值不小于0，即不会小于播放进度条的左侧
  const offsetWidth = Math.min(
    yuanProgress.value.clientWidth - dotWidth,
    Math.max(0, e.clientX - rect.left)
  )
  moveSlide(offsetWidth)
  commitPersent(true)
}

//向父组件传递信息 1.拖动或点击完成 2. 正在拖动中
const commitPersent = (isEnd = false) => {
  const lineWidth = yuanProgress.value.clientWidth - dotWidth
  const persent = yuanProgressPlay.value.clientWidth / lineWidth
  emit(isEnd ? 'percentChangeEnd' : 'percentChange', persent)
}

//鼠标按下圆点，记录下此时的坐标
const barDown = (e) => {
  move.value.isDragging = true
  move.value.startX = e.clientX || e.touches[0].pageX
  move.value.left = yuanProgressPlay.value.clientWidth
}

//鼠标处于拖动中
const barMove = (e) => {
  if (!move.value.isDragging) {
    return
  }
  e.preventDefault()
  let endX = e.clientX || e.touches[0].pageX
  let dist = endX - move.value.startX
  let offsetWidth = Math.min(
    yuanProgress.value.clientWidth - dotWidth,
    Math.max(0, move.value.left + dist)
  )
  moveSlide(offsetWidth)
  commitPersent()
}

//鼠标拖动完成
const barUp = () => {
  if (move.value.isDragging) {
    commitPersent(true)
    move.value.isDragging = false
  }
}
</script>
<template>
  <!-- 最外层，最浅色的条 -->
  <div class="yuanProgress" ref="yuanProgress" @click="barClick">
    <!-- 包含缓冲条和播放条的内层条 -->
    <div class="yuanProgress_inner">
      <!-- 加载缓冲条 -->
      <div class="yuanProgress_load" ref="yuanProgressLoad"></div>
      <!-- 亮色播放条 -->
      <div class="yuanProgress_play" ref="yuanProgressPlay">
        <!-- 播放移动点 -->
        <div class="yuanProgress_dot" @mousedown="barDown"></div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.yuanProgress {
  position: relative;
  padding: 5px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  .yuanProgress_inner {
    height: 2px;
    width: 100%;
    background: @bar_color;
  }
  .yuanProgress_load {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    //向上移动1px
    margin-top: -1px;
    background: rgba(255, 255, 255, 0.2);
  }
  .yuanProgress_play {
    position: absolute;
    top: 50%;
    left: 5px;
    display: inline-block;
    width: 0;
    height: 2px;
    margin-top: -1px;
    background: @line_color;
    .yuanProgress_dot {
      position: absolute;
      top: 50%;
      //向右移动5px
      right: -5px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: @dot_color;
      transform: translateY(-50%);
    }
  }
}
</style>
