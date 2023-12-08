<script setup>
import MusicList from '@/components/MusicList/index.vue'
import { usePlayListStore } from '../../stores/playlist'
import { storeToRefs } from 'pinia'

const playListStore = usePlayListStore()
//将store中的属性转换为ref对象，在模板中可以直接访问，而不用.value
const { currentMusic, playList } = storeToRefs(playListStore)
const { setPlaying, setCurrentIndex } = playListStore

//选择播放
const selectItem = (item, index) => {
  if (item.id !== currentMusic.value.id) {
    setCurrentIndex(index)
    setPlaying(true)
  }
}
</script>
<template>
  <div class="playlist">
    <MusicList :list="playList" list-type="duration" @select="selectItem">
      <div class="list-btn">
        <span>清空列表</span>
      </div>
    </MusicList>
  </div>
</template>
<style lang="less" scoped>
.list-btn {
  .flex-center;
  height: 50px;
  span {
    padding: 5px 20px;
    cursor: pointer;
    user-select: none;
    &:hover {
      color: @text_color_active;
    }
  }
}
</style>
