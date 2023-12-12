<script setup>
import { computed } from 'vue'
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  position: {
    type: String,
    default: 'center'
  }
})

const positionClass = computed(() => {
  return 'toast-' + props.position
})
</script>
<template>
  <div class="toast" :class="positionClass">
    {{ props.message }}
  </div>
</template>
<style lang="less" scoped>
@prefix-cls: toast;

.@{prefix-cls} {
  position: fixed;
  left: 50%;
  z-index: 1000;
  max-width: 80%;
  box-sizing: border-box;
  border-radius: @border_radius;
  padding: 10px 20px;
  overflow: hidden;
  text-align: center;
  min-height: 40px;
  line-height: 20px;
  font-size: 14px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  user-select: none;
  transform: translateX(-50%);
  //animation 属性定义了一个淡入效果，持续 0.3 秒。
  animation: fadenIn 0.3s ease-in;
  &&-top {
    top: 10%;
  }
  &&-center {
    top: 50%;
    margin-top: -20px;
  }
  &&-bottom {
    bottom: 10%;
  }
  @keyframes fadenIn {
    0% {
      opacity: 0;
      transform: translate3d(-50%, -10px, 0);
    }

    100% {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }
}
</style>
