import { createI18n } from 'vue-i18n'
import {useStorage} from '@vueuse/core'
// 本地语言包
import en from './en'
import zh from './zh'

const messages = {
  zh: {
    ...zh,
  },
  en_US: {
    ...en,
  },
}

export const getLanguage = () => {
  const language = useStorage('language', 'zh')
  if (language.value) {
    return language.value
  }
  return 'zh'
}

const i18n = createI18n({
  allowComposition: true, 
  globalInjection: true, // 全局注册$t方法
  legacy: false,
  locale: getLanguage(),
  messages,
})

export default i18n



