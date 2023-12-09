<!-- 渲染函数 -->
<script>
import { h } from 'vue'
export default {
  name: 'ElectroIcon',
  props: {
    type: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      default: 16
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const getIconCls = () => {
      return 'icon-' + props.type
    }
    const getIconStyle = () => {
      return { fontSize: props.size + 'px' }
    }
    const onClick = (e) => {
      emit('click', e)
    }
    // 返回渲染函数,页面渲染如下
    // <i data-v-14fa9872="" data-v-ece81bae="" class="iconfont icon-prev" style="font-size: 16px;"></i>
    return () =>
      h('i', {
        class: 'iconfont ' + getIconCls(),
        style: getIconStyle(),
        //onClick:onClick() 会立即调用 onClick 函数而不是将其作为回调传递给 onClick 事件。因此，每次组件渲染时，都会执行 onClick 函数，导致递归更新。为了解决这个问题，你只需将其改为：
        // onClick: onClick 将 onClick 函数作为回调传递给 onClick 事件，而不是立即执行它。
        onClick: onClick
      })
  }
}
</script>

<style lang="less" scoped>
.iconfont {
  display: inline-block;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  line-height: 1;
  vertical-align: baseline;
  text-transform: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
