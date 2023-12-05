//实现代码的复用功能：加载动画
//loading状态

import { ref } from 'vue'
export const useLoading = () => {
  let timer = null
  const isLoading = ref(true)

  const hideLoad = () => {
    timer = setTimeout(() => {
      isLoading.value = false
    }, 200)
  }
  clearTimeout(timer)

  return { isLoading, hideLoad }
}
