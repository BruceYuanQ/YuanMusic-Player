<script setup>
import ElectroDialog from 'base/electroDialog/ElectroDialog.vue'
import { useUserStore } from '@/stores/user'
import { getUserDetails } from '@/api/userinfo'
import { storeToRefs } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import { showToast } from 'base/electroToast/index'
import { toHttps } from '@/utils/util'

const userStore = useUserStore()
const { uid, avatarUrl, nickname } = storeToRefs(userStore)
const { setUid, setAvatarUrl, setNickname } = userStore

const uidValue = ref('')
// 弹窗模板引用
const loginDialog = ref(null)
const helpDialog = ref(null)
const logoutDialog = ref(null)

const isLoggedin = computed(() => {
  return uid.value !== ''
})

onMounted(() => {
  uid.value && getUserInfo(uid.value)
})

const opendialog = (type) => {
  switch (type) {
    case 'login':
      loginDialog.value.show()
      break
    case 'help':
      loginDialog.value.hide()
      helpDialog.value.show()
      break
    case 'logout':
      logoutDialog.value.show()
      break
  }
}

const login = () => {
  if (uidValue.value === '') {
    showToast({ message: 'UID 不能为空', position: 'top' })
    opendialog('login')
    return
  }
  getUserInfo(uidValue.value)
  uidValue.value = ''
}

const logout = () => {
  setUid('')
  setAvatarUrl('')
  setNickname('')
  uidValue.value = ''
  showToast({ message: '退出成功!', position: 'top' })
}

const getUserInfo = async (uid) => {
  const userDetails = await getUserDetails(uid)
  const { profile } = userDetails
  if (profile === undefined) {
    showToast({ message: `未找到 UID 为 ${uid} 的用户信息`, position: 'top' })
    return
  }
  const { avatarUrl, nickname } = profile
  setUid(uid)
  setAvatarUrl(toHttps(avatarUrl))
  setNickname(nickname)
  setTimeout(() => {
    showToast({
      message: `${nickname} 欢迎使用 Yuan Player`,
      position: 'top'
    })
  }, 200)
}
</script>
<template>
  <header class="El-header">
    <h1 class="header">
      <a href="">Yuan 在线音乐播放器</a>
    </h1>
    <!-- 用户信息--头像和登录 -->
    <dl class="user">
      <template v-if="isLoggedin">
        <RouterLink to="/music/userlist" custom v-slot="{ navigate }">
          <dt @click="navigate" class="user-info" role="link">
            <img :src="avatarUrl" class="avatar" alt="img" />
            <span class="user-name">{{ nickname }}</span>
          </dt>
        </RouterLink>
        <dd class="user-btn" @click="opendialog('logout')">退出</dd>
      </template>
      <dd v-else class="user-btn" @click="opendialog('login')">登录</dd>
    </dl>

    <!-- 登录弹窗 -->
    <ElectroDialog
      ref="loginDialog"
      head-text="登录"
      confirm-btn-text="登录"
      cancel-btn-text="关闭"
      @confirm="login"
    >
      <div class="electro-dialog-text">
        <input
          type="number"
          v-model.trim="uidValue"
          class="electro-dialog-input"
          placeholder="请输入您的网易云 UID"
          v-focus
          @keyup.enter="login"
        />
      </div>
      <template #btn>
        <div @click="opendialog('help')">帮助</div>
      </template>
    </ElectroDialog>

    <!-- 帮助弹窗 -->
    <ElectroDialog
      ref="helpDialog"
      head-text="登录帮助"
      confirm-btn-text="去登录"
      cancel-btn-text="关闭"
      @confirm="opendialog('login')"
    >
      <div class="electro-dialog-text">
        <p>
          1、
          <a target="_blank" href="https://music.163.com"
            >点我(https://music.163.com)</a
          >
          打开网易云音乐官网
        </p>
        <p>2、点击页面右上角的“登录”</p>
        <p>3、点击您的头像，进入我的主页</p>
        <p>4、复制浏览器地址栏 /user/home?id= 后面的数字（网易云 UID）</p>
      </div>
    </ElectroDialog>
    <!-- 退出弹窗 -->
    <ElectroDialog
      ref="logoutDialog"
      body-text="确定退出当前用户吗？"
      @confirm="logout"
    ></ElectroDialog>
  </header>
</template>
<style lang="less" scoped>
.El-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  @media (max-width: 768px) {
    background-color: @header_bg_color;
  }

  .header {
    .flex-center;
    font-style: italic;
    a {
      padding: 0 10px;
      line-height: 60px;
      font-size: 20px;
      font-weight: 800;
      //文字颜色为透明
      color: transparent;
      background: url('assets/slideImg/silver.jpg');
      background-position: 30% 30%;
      text-align: center;
      //将背景图片裁剪成文本的形状，使得文字部分显示背景图片
      background-clip: text;
      -webkit-background-clip: text;
      //应用名为 slide-img 的动画，动画时长为 30 秒，使用线性运动曲线，无限循环播放，交替反向播放，并在最后保持动画结束时的状态。
      animation: slide-img 30s linear infinite alternate-reverse forwards;
    }

    @media (max-width: 768px) {
      padding-left: 15px;
      //左对齐
      justify-content: flex-start;
    }
    @media (max-width: 414px) {
      font-size: @font_size_medium;
    }
  }
  .user {
    position: absolute;
    top: 50%;
    right: 15px;
    line-height: 30px;
    text-align: right;
    transform: translateY(-50%);
    display: flex;
    gap: 15px;
    &-info {
      cursor: pointer;
      .avatar {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: middle;
      }
      .user-name {
        display: inline-block;
        margin-left: 10px;
        color: @text_color_active;
      }
    }
    &-btn {
      cursor: pointer;
      &:hover {
        color: @text_color_active;
      }
    }

    @media (max-width: 768px) {
      &-info {
        margin-right: 10px;
        span {
          display: none;
        }
      }
    }
  }
}

.electro-dialog-text {
  text-align: left;
  .electro-dialog-input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    border: 1px solid @btn_color;
    outline: 0;
    background: transparent;
    color: @text_color_active;
    font-size: @font_size_medium;
    box-shadow: 0 0 1px 0 #fff inset;
    &::placeholder {
      color: @text_color;
    }
  }
  a:hover {
    color: #d43c33;
  }
}

//background-position 属性在动画的关键帧之间进行插值，从而实现图像背景位置的平滑过渡
@keyframes slide-img {
  0% {
    background-position: 30% 30%;
  }
  100% {
    background-position: 70% 70%;
  }
}
</style>
