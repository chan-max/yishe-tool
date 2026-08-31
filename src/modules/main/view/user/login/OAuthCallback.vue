<template>
  <div class="oauth-callback">
    <div class="oauth-callback__card">
      <!-- 加载中 -->
      <div v-if="status === 'loading'" class="oauth-callback__loading">
        <Loader2 class="oauth-callback__spinner" />
        <p class="oauth-callback__text">正在登录...</p>
      </div>

      <!-- 成功 -->
      <div v-else-if="status === 'success'" class="oauth-callback__success">
        <CheckCircle2 class="oauth-callback__icon oauth-callback__icon--success" />
        <p class="oauth-callback__text">登录成功，正在跳转...</p>
      </div>

      <!-- 失败 -->
      <div v-else class="oauth-callback__error">
        <AlertCircle class="oauth-callback__icon oauth-callback__icon--error" />
        <p class="oauth-callback__text">{{ errorMsg }}</p>
        <div class="oauth-callback__actions">
          <Button class="oauth-callback__btn" @click="goBack">返回首页</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { useLoginStatusStore } from '@/store/stores/login'
import { message } from '@/common/message'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMsg = ref('')

onMounted(async () => {
  const token = route.query.token as string
  const error = route.query.error as string

  console.log('[OAuth] 回调页面, query:', route.query)

  if (error) {
    status.value = 'error'
    errorMsg.value = '授权被拒绝'
    return
  }

  if (!token) {
    status.value = 'error'
    errorMsg.value = '缺少 token，请重新尝试'
    return
  }

  try {
    const loginStore = useLoginStatusStore()

    // 设置 token 和登录状态
    loginStore.token = token
    loginStore.isLogin = true
    loginStore.loginTime = new Date().getTime()

    // 获取用户信息
    const userInfo = await loginStore.getUserInfo()
    if (!userInfo) {
      throw new Error('获取用户信息失败')
    }

    console.log('[OAuth] 登录成功')
    status.value = 'success'
    message.success('登录成功!')

    setTimeout(() => {
      router.replace({ name: 'Design' })
    }, 500)
  } catch (err: any) {
    console.error('[OAuth] 登录失败:', err)
    status.value = 'error'
    errorMsg.value = err?.message || '登录失败，请重试'
  }
})

function goBack() {
  router.replace({ name: 'Design' })
}
</script>

<style scoped>
.oauth-callback {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--1s-shell-background, #eef2f7);
}

.oauth-callback__card {
  width: 320px;
  text-align: center;
  padding: 32px;
  background: var(--1s-dialog-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.oauth-callback__loading,
.oauth-callback__success,
.oauth-callback__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.oauth-callback__spinner {
  width: 32px;
  height: 32px;
  color: var(--primary, #18181b);
  animation: spin 1s linear infinite;
}

.oauth-callback__icon {
  width: 40px;
  height: 40px;
}

.oauth-callback__icon--success {
  color: #22c55e;
}

.oauth-callback__icon--error {
  color: #ef4444;
}

.oauth-callback__text {
  font-size: 13px;
  color: var(--muted-foreground, #71717a);
  margin: 0;
  word-break: break-all;
}

.oauth-callback__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.oauth-callback__btn {
  height: 32px;
  font-size: 12px;
  flex: 1;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
