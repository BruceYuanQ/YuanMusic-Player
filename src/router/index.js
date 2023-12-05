import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/music' },
    {
      path: '/music',
      component: () => import('../views/Music.vue'),
      redirect: '/music/playlist',
      children: [
        {
          path: '/music/playlist', //正在播放
          component: () => import('../views/playlist/index.vue')
        },
        {
          path: '/music/userlist', //我的
          component: () => import('../views/userlist/index.vue'),
          meta: {
            title: '我的歌单'
          }
        },
        {
          path: '/music/toplist', //排行榜
          component: () => import('../views/toplist/index.vue'),
          meta: {
            title: '排行榜'
          }
        },
        {
          path: '/music/details/:id', //歌曲详情
          component: () => import('../views/detail/index.vue')
        },
        {
          path: '/music/historylist', //我听过的
          component: () => import('../views/historylist/index.vue'),
          meta: {
            title: '我听过的'
          }
        },
        {
          path: '/music/search', //歌曲搜索
          component: () => import('../views/search/index.vue'),
          meta: {
            title: '搜索'
          }
        },
        {
          path: '/music/comment/:id', //音乐评论
          component: () => import('../views/comment/index.vue'),
          meta: {
            title: '评论详情'
          }
        }
      ]
    }
  ]
})

export default router
