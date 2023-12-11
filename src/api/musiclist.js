import request from '@/utils/request.js'
import { formatSongs } from '../utils/song'

//根据歌单id获取歌单列表
export const getPlayListById = async (id) => {
  try {
    const res = await request.get('/playlist/detail', {
      params: { id }
    })
    const playList = res.playlist || {}
    const { trackIds, tracks } = playList
    //过滤完整歌单
    if (trackIds.length === tracks.length) {
      playList.tracks = formatSongs(playList.tracks)
    } else {
      const ids = trackIds
        .slice(0, 500)
        .map((v) => v.id)
        .toString()
      const resSongs = await getSongDetail(ids)
      playList.tracks = formatSongs(resSongs.songs)
    }
    return playList
  } catch (error) {
    console.log(error)
  }
}

//获取歌曲详情
export const getSongDetail = (ids) => {
  return request.get('/song/detail', {
    params: {
      ids
    }
  })
}

//获取歌曲的歌词
export const getLyric = (id) => {
  return request.get('/lyric', {
    params: {
      id
    }
  })
}
