<script setup>
import MusicList from '@/components/MusicList/index.vue'
import { usePlayListStore } from '../../stores/playlist'
import { storeToRefs } from 'pinia'

const playListStore = usePlayListStore()
//将store中的属性转换为ref对象，在模板中可以直接访问，而不用.value
const { playList } = storeToRefs(playListStore)
</script>
<template>
  <div class="playlist">
    <MusicList :list="playList">
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
