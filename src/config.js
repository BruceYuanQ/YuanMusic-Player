//基础文件配置

//背景图
import bg2 from 'assets/background/bg-2.jpg'
import bg3 from 'assets/background/bg-3.jpg'
import bg4 from 'assets/background/bg-4.jpg'
import bg5 from 'assets/background/bg-5.jpg'
const BACKGROUNDS = [bg2, bg3, bg4, bg5]

// 播放模式
// LIST_LOOP:列表循环
// ORDER:顺序播放
// RABDOM:随机播放
// ONE_LOOP:单曲循环
export const PLAY_MODE = {
  LIST_LOOP: 0,
  ORDER: 1,
  RANDOM: 2,
  ONE_LOOP: 3
}

// 播放器默认配置
export const EL_CONFIG = {
  // 默认歌单id（正在播放列表）网易云音乐热歌榜
  PLAYLIST_ID: 3778678,
  // 默认播放模式
  PLAY_MODE: PLAY_MODE.LIST_LOOP,
  // 默认音量
  VOLUME: 0.8,
  // 默认背景
  BACKGROUND: BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)]
}
