import { createI18n } from 'vue-i18n'

export default createI18n({
  locale: 'cn', // 设置当前语言类型
  allowComposition: true, 
  globalInjection: true, // 全局注册$t方法
  messages: {
    cn: {
     language:'cn'
    },
    en: {
      language:'en'
    },
  },
})

