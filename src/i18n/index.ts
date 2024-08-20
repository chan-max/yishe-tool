import { createI18n,useI18n } from 'vue-i18n'
import { useStorage } from '@vueuse/core'
// 本地语言包
import en from './en'
import zh from './zh'


export enum LanguageType {
  Chinese = 'zh',
  English = 'en'
}

const messages = {
  [LanguageType.Chinese]: {
    ...zh,
  },
  [LanguageType.English]: {
    ...en,
  },
}

export const LanguageOptions = [
  {
    label:'中文',
    value:LanguageType.Chinese
  },
  {
    label:'English',
    value:LanguageType.English
  },
]

export const language = useStorage('language', 'zh')

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

export function changeLanguage(val:LanguageType) {
  const { t, locale } = i18n.global;
 language.value = val
 locale.value = val
}

export default i18n



