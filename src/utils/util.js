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

//检查一个值是否为promise对象
export function isPromise(v) {
  // v 不是undefined 和 null 且 v的 then 属性是个函数
  return v !== undefined && v !== null && typeof v.then === 'function'
}

//修复点击播放后 快速点击暂停导致的错误
export function silencePromise(value) {
  if (isPromise) {
    //注册一个空的reject函数，防止为空捕获异常
    value.then(null, () => {})
  }
}
