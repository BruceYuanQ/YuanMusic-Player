<script setup>
import ElectroProgress from '@/base/electroProgress/index.vue'
import { ref, computed } from 'vue'

const props = defineProps({
  volume: {
    type: Number,
    reauired: true
  }
})

//记录静音前的音量，取消静音后恢复
const lastVolume = ref(props.volume)

const volumeProgress = computed(() => {
  return props.volume
})

const volumeType = computed(() => {
  return volumeProgress.value ? 'turnon' : 'turnoff'
})

const toggleType = () => {
  let volume
  if (volumeProgress.value) {
    volume = 0
    lastVolume.value = volumeProgress.value
  } else {
    volume = lastVolume.value
  }
  handleVolumeChange(volume)
}

const handleVolumeChange = (persent) => {
  emit('volumeChange', persent)
}

const emit = defineEmits(['volumeChange'])
</script>
<template>
  <div class="volume">
    <ElectroIcon
      :type="volumeType"
      :size="30"
      class="pointer volume-icon"
      @click="toggleType"
    ></ElectroIcon>
    <div class="volume-progress-wrapper">
      <ElectroProgress
        :persent="volumeProgress"
        @percentChangeEnd="handleVolumeChange"
        @percentChange="handleVolumeChange"
      ></ElectroProgress>
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
  &-progress-wrapper {
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
