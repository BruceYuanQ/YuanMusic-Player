import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { lazyPlugin } from './directives'
import '@/styles/index.less'
import Icon from 'base/electrolcon/index.vue'

const app = createApp(App)

app.component(Icon.name, Icon)

app.use(createPinia())
app.use(router)
app.use(createPinia().use(persist))
app.use(lazyPlugin)

app.mount('#app')
