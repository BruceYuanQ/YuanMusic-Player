<script setup>
import { formatSecond } from '@/utils/util.js'

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
console.log(props)

//转换时间为mm:ss
const getFormatTime = (seconds) => {
  return formatSecond(seconds)
}

const listScroll = () => {
  // const scrollTop = e.target.scrollTop
  // const { scrollHeight, offsetHeight } = e.target
  // console.log(scrollTop, scrollHeight, offsetHeight)
}
</script>
<template>
  <div class="music-list flex-col">
    <template v-if="true">
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span class="list-time">时长</span>
        <!-- <span class="list-album">专辑</span> -->
      </div>

      <div class="list-content" @scroll="listScroll">
        <div class="list-item" v-for="(item, index) in list" :key="item.id">
          <div class="list-num" v-text="index + 1"></div>
          <div class="list-name">{{ item.name }}</div>
          <div class="list-artist">{{ item.singer }}</div>
          <div class="list-time">{{ getFormatTime(item.duration % 3600) }}</div>
          <!-- <span class="list-album">album</span> -->
        </div>
        <slot list="listBtn"></slot>
      </div>
    </template>

    <div v-else>--空空如也--</div>
  </div>
</template>
<style lang="less" scoped>
.music-list {
  height: 100%;
  min-height: 0;
}
.list-header {
  border-bottom: 1px solid @list_head_line_color;
  color: @text_color_active;
  .list-name {
    padding-left: 40px;
    user-select: none;
  }
}
.list-content {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.list-item {
  display: flex;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid @list_item_line_color;
  line-height: 50px;
  overflow: hidden;
  .list-num {
    display: block;
    width: 30px;
    margin-right: 10px;
    text-align: center;
  }
  .list-name {
    position: relative;
    flex: 1;
    box-sizing: border-box;
    .list-name-text {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .list-menu-icon {
      display: none;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
  }
  .list-artist,
  .list-album {
    display: block;
    width: 300px;
    .no-wrap();
    @media (max-width: 1440px) {
      width: 200px;
    }
    @media (max-width: 1200px) {
      width: 150px;
    }
  }
  .list-artist {
    width: 250px;
  }
  .list-time {
    display: block;
    width: 60px;
    position: relative;
    .list-menu-icon-del {
      display: none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
.list-item:hover {
  .list-name {
    padding-right: 80px;
    .list-menu-icon {
      display: block;
    }
  }
  .list-time {
    .list-time-format {
      font-size: 0;
    }
    .list-menu-icon-del {
      display: block;
    }
  }
}
@media (max-width: 960px) {
  .list-item .list-name {
    padding-right: 40px;
  }
}
@media (max-width: 768px) {
  .list-item {
    .list-name .list-menu {
      display: block;
    }
    .list-artist,
    .list-album {
      width: 30%;
    }
  }
}
@media (max-width: 640px) {
  .list-item {
    .list-artist {
      width: 40%;
    }
    .list-album,
    .list-time {
      display: none;
    }
  }
}
</style>
