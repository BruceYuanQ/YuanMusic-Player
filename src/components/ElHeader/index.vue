<script setup></script>
<template>
  <header class="El-header">
    <h1 class="header">
      <a href="">Yuan 在线音乐播放器</a>
    </h1>
  </header>
</template>
<style lang="less" scoped>
.El-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  @media (max-width: 768px) {
    background-color: @header_bg_color;
  }

  .header {
    .flex-center;
    font-style: italic;
    a {
      padding: 0 10px;
      line-height: 60px;
      font-size: 20px;
      font-weight: 800;
      //文字颜色为透明
      color: transparent;
      background: url('assets/slideImg/silver.jpg');
      background-position: 30% 30%;
      text-align: center;
      //将背景图片裁剪成文本的形状，使得文字部分显示背景图片
      background-clip: text;
      -webkit-background-clip: text;
      //应用名为 slide-img 的动画，动画时长为 30 秒，使用线性运动曲线，无限循环播放，交替反向播放，并在最后保持动画结束时的状态。
      animation: slide-img 30s linear infinite alternate-reverse forwards;
    }

    @media (max-width: 768px) {
      padding-left: 15px;
      //左对齐
      justify-content: flex-start;
    }
    @media (max-width: 414px) {
      font-size: @font_size_medium;
    }
  }
}
//background-position 属性在动画的关键帧之间进行插值，从而实现图像背景位置的平滑过渡
@keyframes slide-img {
  0% {
    background-position: 30% 30%;
  }
  100% {
    background-position: 70% 70%;
  }
}
</style>
