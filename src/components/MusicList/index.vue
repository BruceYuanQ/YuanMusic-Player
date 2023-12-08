<script setup>
import { computed } from 'vue'
import { formatSecond } from '@/utils/util.js'
import { usePlayListStore } from '@/stores/playlist.js'
import { storeToRefs } from 'pinia'
const playListStore = usePlayListStore()
//从playListStore提取currentMusic，isPlaying属性，并将其转换为响应式
const { currentMusic, isPlaying } = storeToRefs(playListStore)
const { setPlaying } = playListStore

const emit = defineEmits(['select'])

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  /**
   * 列表类型
   * album：显示专辑栏目（默认）
   * duration：显示时长栏目
   * pullUp：开启无限加载--往下滑到底加载新的歌曲
   **/
  listType: {
    type: String,
    default: 'album'
  }
})

//转换时间为mm:ss
const getFormatTime = (seconds) => {
  return formatSecond(seconds)
}

const listScroll = () => {
  // const scrollTop = e.target.scrollTop
  // const { scrollHeight, offsetHeight } = e.target
  // console.log(scrollTop, scrollHeight, offsetHeight)
}

//根据歌曲是否播放 设定图标
const getStateType = ({ id: itemId }) => {
  return isPlaying.value && currentMusic.value.id === itemId
    ? 'pause-circle'
    : 'play-circle'
}

//判断显示时长还是专辑名称
const isDuration = computed(() => {
  return props.listType === 'duration'
})

//双击选择特定歌曲播放
const selectItem = (item, index) => {
  //如果当前音乐已在播放则将停止播放
  if (currentMusic.value.id && item.id === currentMusic.value.id) {
    setPlaying(!isPlaying.value)
    return
  }
  //切换当前播放音乐，传递给父组件，父组件将进行播放操作
  emit('select', item, index)
}
</script>
<template>
  <div class="music-list flex-col">
    <template v-if="true">
      <div class="list-item list-header">
        <span class="list-name">歌曲</span>
        <span class="list-artist">歌手</span>
        <span v-if="isDuration" class="list-time">时长</span>
        <span v-else class="list-album">专辑</span>
      </div>

      <div class="list-content" @scroll="listScroll">
        <div
          class="list-item"
          v-for="(item, index) in list"
          :key="item.id"
          :class="{ on: isPlaying && currentMusic.id === item.id }"
          @dblclick="selectItem(item, index)"
        >
          <div class="list-num" v-text="index + 1"></div>
          <div class="list-name">
            <span>{{ item.name }}</span>
            <ElectroIcon
              :type="getStateType(item)"
              :size="32"
              class="hover list-menu-icon"
            ></ElectroIcon>
          </div>
          <div class="list-artist">{{ item.singer }}</div>
          <div v-if="isDuration" class="list-time">
            <span class="list-time-format">{{
              getFormatTime(item.duration % 3600)
            }}</span>
            <!-- 搜索结果搜索出来的列表不能删除，因此将删除图标放在这个位置 -->
            <ElectroIcon
              type="delete"
              :size="32"
              class="hover list-menu-icon-del"
            ></ElectroIcon>
          </div>
          <span v-else class="list-album">{{ item.album }}</span>
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
  &.on {
    color: #fff;
    .list-num {
      font-size: 0;
      // 正在播放歌曲序号变成正在播放wave动画
      background: url('assets/img/wave.gif') no-repeat center center;
    }
  }
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
