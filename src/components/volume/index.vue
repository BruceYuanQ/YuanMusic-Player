<script setup>
import ElectroProgress from '@/base/electroProgress/index.vue'
</script>
<template>
  <div class="volume">
    <ElectroIcon
      type="turnon pointer volume-icon"
      :size="30"
      class="pointer volume-icon"
    ></ElectroIcon>
    <div class="volume-progress-wrapper">
      <ElectroProgress></ElectroProgress>
    </div>
  </div>
</template>
<style lang="less" scoped>
.volume {
  display: flex;
  align-items: center;
  width: 150px;
  &-icon {
    margin-right: 5px;
    color: #fff;
  }
  &-volume-wrapper {
    flex: 1;
  }
  @media (max-width: 768px) {
    width: 36px;
    .volume-progress-wrapper {
      display: none;
    }
  }
}
</style>
