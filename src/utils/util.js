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

// 歌词解析函数
/**[mm:ss.SSS] xxxxx\n
 * 转换为 s:xxxxx
 */
//提取出分钟、秒和毫秒 对象
const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g
export const parseLyric = (lrc) => {
  //分割后 每个数组元素就是歌词中的一行文本。
  const lines = lrc.split('\n')
  const lyric = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    //从line中匹配到的时间标签的结果数组
    const timeGroup = timeExp.exec(line)
    if (!timeGroup) {
      //如果当前歌词行没有匹配的时间信息，则跳过当前循环
      continue
    }
    //获取纯文本部分
    const text = line.replace(timeExp, '').trim()
    if (text) {
      lyric.push({
        time:
          //将第一个捕获组（(\d{2,})，即分钟部分）的值乘以 60,000，将其转换为毫秒。
          //将第二个捕获组（(\d{2})，即秒部分）的值乘以 1,000，将其转换为毫秒。
          //如果存在第三个捕获组（(?:\.(\d{2,3}))?，即毫秒部分），则将其值乘以 1；如果不存在，使用默认值 0。
          (timeGroup[1] * 6e4 + timeGroup[2] * 1e3 + (timeGroup[3] || 0) * 1) /
          1e3,
        text: text
      })
    }
  }
  return lyric
}
