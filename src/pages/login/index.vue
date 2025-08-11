<template>
  <div class="login-container">
    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">海洋教育后台管理系统</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <el-icon><User /></el-icon>
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <el-icon><Lock /></el-icon>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <el-icon>
              <View v-if="passwordType === 'password'" />
              <Hide v-else />
            </el-icon>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="captcha">
        <span class="svg-container">
          <el-icon><Key /></el-icon>
        </span>
        <el-input
          v-model="loginForm.captcha"
          placeholder="验证码"
          name="captcha"
          type="text"
          tabindex="3"
          autocomplete="off"
          style="width: 63%; margin-right: 2%"
          @keyup.enter="handleLogin"
        />
        <div class="captcha" @click="refreshCaptcha">
          <img :src="captchaImg" alt="验证码" />
        </div>
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.prevent="handleLogin"
      >
        登录
      </el-button>

      <div style="position: relative">
        <div class="tips">
          <span>用户名: admin</span>
          <span>密码: 123456</span>
          <span>验证码: 1234</span>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { getCaptcha } from '@/api/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loginFormRef = ref<FormInstance>()
const passwordType = ref('password')
const capsTooltip = ref(false)
const loading = ref(false)
const captchaImg = ref('')

const loginForm = reactive({
  username: 'admin',
  password: '123456',
  captcha: ''
})

const loginRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
  // 临时禁用验证码验证
  // captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

const showPwd = () => {
  if (passwordType.value === 'password') {
    passwordType.value = ''
  } else {
    passwordType.value = 'password'
  }
  nextTick(() => {
    // focus input
  })
}

const checkCapslock = (e: KeyboardEvent) => {
  const { key } = e
  capsTooltip.value = key && key.length === 1 && (key >= 'A' && key <= 'Z')
}

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 临时跳过验证码验证
        const loginData = {
          username: loginForm.username,
          password: loginForm.password,
          captcha: '1234' // 临时固定验证码
        }
        await authStore.login(loginData)
        router.push({ path: (route.query.redirect as string) || '/', replace: true })
        ElMessage.success('登录成功')
      } catch (error) {
        console.error('登录失败:', error)
        refreshCaptcha()
      } finally {
        loading.value = false
      }
    }
  })
}

const refreshCaptcha = async () => {
  try {
    // 临时禁用验证码功能，避免后端连接错误
    // const { data } = await getCaptcha()
    // captchaImg.value = data.img
    
    // 创建一个简单的验证码图片，显示 "1234"
    captchaImg.value = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI2MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTIzNDwvdGV4dD48L3N2Zz4='
  } catch (error) {
    console.error('获取验证码失败:', error)
  }
}

onMounted(() => {
  refreshCaptcha()
})
</script>

<style lang="scss" scoped>
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

.login-container {
  min-height: 100vh;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;

    :deep(.el-form-item) {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    :deep(.el-input) {
      display: inline-block;
      height: 47px;
      width: 85%;

      .el-input__wrapper {
        padding: 0;
        background: transparent;
        border: none;
        border-radius: 0px;
        box-shadow: none;
      }

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $light_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $light_gray;
    cursor: pointer;
    user-select: none;
  }

  .captcha {
    width: 33%;
    height: 47px;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      border-radius: 5px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
}
</style>