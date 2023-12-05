export const toHttps = (url) => {
  if (typeof url !== 'string') {
    return url
  }
  return url.replace('http://', 'https://')
}

//时间格式化函数
//秒数 ---> mm:ss
export const formatSecond = (seconds) => {
  const minute = Math.floor(seconds / 60)
  const minuteStr = minute < 10 ? '0' + minute : minute + ''
  const second = Math.floor(seconds % 60)
  const secondStr = second < 10 ? '0' + second : second + ''
  return minuteStr + ':' + secondStr
}
