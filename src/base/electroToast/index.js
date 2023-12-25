import Toast from './index.vue'
import { render, h } from 'vue'

const defaultOptions = {
  duration: 1500
}

export class ToastCreater {
  options
  container
  constructor(options) {
    this.options = options
    this.container = document.createElement('div')
  }

  //展示toast
  present() {
    //创建toast组件的虚拟节点
    const toast = h(Toast, this.options)
    render(toast, this.container)
    document.body.insertBefore(this.container, document.body.firstChild)

    //到时间消除
    if (defaultOptions.duration) {
      setTimeout(() => {
        this.dismiss()
      }, defaultOptions.duration)
    }
  }

  //消除方法
  dismiss() {
    document.body.removeChild(this.container)
  }
}

export const showToast = ({ message, position }) => {
  const toast = new ToastCreater({
    message,
    position
  })
  toast.present()
}
