import { toHttps } from '../utils/util.js'

//song的处理函数，将通过api获取的歌单res,转换为songs对象数组，把关键信息提取出来
export const formatSongs = (list) => {
  const Songs = []
  list.forEach((item) => {
    const musicData = item
    if (musicData.id) {
      Songs.push(createSong(musicData))
    }
  })
  return Songs
}

const createSong = (music) => {
  const album = music.al || music.album || {}
  const duration = music.dt || music.duration
  return new Song({
    id: music.id,
    name: music.name,
    singer: getSingers(music.ar || music.artists),
    album: album.name,
    image: toHttps(album.picUrl) || null,
    duration: duration / 1000,
    url: `https://music.163.com/song/media/outer/url?id=${music.id}.mp3`
  })
}
class Song {
  constructor({ id, name, singer, album, image, duration, url }) {
    this.id = id
    this.name = name
    this.singer = singer
    this.album = album
    this.image = image
    //音乐时长
    this.duration = duration
    this.url = url
  }
}
//将多个singers之间用/连接
const getSingers = (singers) => {
  const nameList = singers.map((item) => item.name)
  //将第一个元素作为初始的 acc，然后将每个后续元素和当前的 acc 执行回调函数，最终得到一个归并后的值
  return nameList.reduce((acc, item) => {
    return acc + '/' + item
  })
}
