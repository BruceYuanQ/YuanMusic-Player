<script setup></script>
<template>
  <!-- 最外层，最浅色的条 -->
  <div class="yuanProgress">
    <!-- 包含缓冲条和播放条的内层条 -->
    <div class="yuanProgress_inner">
      <!-- 加载缓冲条 -->
      <div class="yuanProgress_load"></div>
      <!-- 亮色播放条 -->
      <div class="yuanProgress_play">
        <!-- 播放移动点 -->
        <div class="yuanProgress_dot"></div>
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
    width: 50%;
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
    width: 20%;
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
