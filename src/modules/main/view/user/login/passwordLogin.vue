<template>
  <div class="flex flex-col gap-5 py-2">
    <!-- Header -->
    <div class="flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground">
        <img src="/favicon.png" class="h-4 w-4 object-contain brightness-0 invert" />
      </div>
      <div>
        <div class="text-sm font-semibold text-foreground">{{ productName }}</div>
        <div class="text-[11px] text-muted-foreground">登录以继续使用设计工具</div>
      </div>
    </div>

    <!-- Form -->
    <div class="flex flex-col gap-3">
      <!-- Account -->
      <div class="flex flex-col gap-1.5">
        <Label for="account" class="text-xs font-medium">账号 / 邮箱</Label>
        <div class="relative">
          <User class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="account"
            v-model="loginForm.account"
            placeholder="请输入账号或邮箱"
            class="pl-8 h-8 text-xs"
            @keyup.enter="submit"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="flex flex-col gap-1.5">
        <Label for="password" class="text-xs font-medium">密码</Label>
        <div class="relative">
          <Lock class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            class="pl-8 pr-8 h-8 text-xs"
            @keyup.enter="submit"
          />
          <button
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            @click="showPassword = !showPassword"
          >
            <Eye v-if="showPassword" class="h-3.5 w-3.5" />
            <EyeOff v-else class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Error -->
      <p v-if="errMsg" class="text-[11px] text-destructive leading-tight">{{ errMsg }}</p>

      <!-- Login btn -->
      <Button
        class="h-8 w-full text-xs font-medium"
        :disabled="loading"
        @click="submit"
      >
        <Loader2 v-if="loading" class="mr-1.5 h-3.5 w-3.5 animate-spin" />
        {{ loading ? '登录中...' : '登 录' }}
      </Button>
    </div>

    <!-- Divider -->
    <div class="flex items-center gap-3">
      <div class="h-px flex-1 bg-border" />
      <span class="text-[11px] text-muted-foreground">或</span>
      <div class="h-px flex-1 bg-border" />
    </div>

    <!-- OAuth -->
    <Button
      variant="outline"
      class="h-8 w-full gap-2 text-xs"
      :disabled="oauthLoading"
      @click="handleOAuthLogin"
    >
      <Loader2 v-if="oauthLoading" class="h-3.5 w-3.5 animate-spin" />
      <LogIn v-else class="h-3.5 w-3.5" />
      一键授权登录
    </Button>

  </div>
</template>

<script setup>
import { publicAppConfig } from '@/config/public'
import { reactive, ref } from 'vue'
import { login } from '@/api/index'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { User, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-vue-next'
import { doLoginAction } from '@/store/stores/loginAction'
import { showLoginFormModal } from '@/modules/main/view/user/login/index.tsx'
import { openAuthorizePage } from '@/api/oauth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const router = useRouter()
const productName = publicAppConfig.shortName

const loading = ref(false)
const oauthLoading = ref(false)
const showPassword = ref(false)
const errMsg = ref('')
const isOnce = ref(false)

const loginForm = reactive({ account: '', password: '' })

async function submit() {
  errMsg.value = ''
  if (loginForm.account.length < 5 || loginForm.password.length < 5) {
    errMsg.value = '账号或密码格式不正确'
    return
  }
  loading.value = true
  try {
    const res = await login({
      username: loginForm.account,
      password: loginForm.password,
      terminalType: '1s',
    })
    await doLoginAction(res.data, isOnce.value)
    message.success('登录成功!')
    if (showLoginFormModal.value) {
      showLoginFormModal.value = false
    } else {
      router.replace({ name: 'Design' })
    }
  } catch (e) {
    errMsg.value = e?.response?.data?.message || e?.message || '登录失败，请检查账号密码'
  } finally {
    loading.value = false
  }
}

async function handleOAuthLogin() {
  oauthLoading.value = true
  try {
    openAuthorizePage()
  } catch (e) {
    errMsg.value = e?.message || '打开授权页面失败'
  } finally {
    oauthLoading.value = false
  }
}
</script>
