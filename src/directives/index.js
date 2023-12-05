//定义图片的懒加载
import { useIntersectionObserver } from '@vueuse/core'

export const lazyPlugin = {
  install(app) {
    app.directive('img-lazy', {
      mounted(el, binding) {
        const { stop } = useIntersectionObserver(el, ([{ isIntersecting }]) => {
          if (isIntersecting) {
            //图片进入视口区域
            el.src = binding.value
            stop()
          }
        })
      }
    })
  }
}
