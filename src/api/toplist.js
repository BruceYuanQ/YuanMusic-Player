import request from '@/utils/request'

// 获取排行榜列表
export const getTopListDetail = () => {
  return request.get('/toplist/detail')
}

// 推荐歌单
export const getPersonalized = () => {
  return request.get('/personalized')
}
