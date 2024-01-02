<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-02 19:17:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-02 20:47:16
 * @FilePath: /1s/src/modules/app/views/index/indexSideMenu.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
        <div style="display:flex;flex-direction:column;width:100%;height:100%;">
          <ion-item>
          <ion-avatar slot="start">
            <img
              alt="avatar"
              src="https://ionicframework.com/docs/img/demos/avatar.svg"
            />
          </ion-avatar>
          <ion-label>暂未登录</ion-label>
        </ion-item>
        <div style="flex:1;"></div>
        <ion-toggle  label-placement="end" @ionChange="toggle" :checked="isDark">
            启用夜间模式
        </ion-toggle>
        </div>
</template>
<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { onMounted } from 'vue';
import {IonToggle,IonItem,IonLabel,IonAvatar} from '@ionic/vue'

const isDark = useDark({
  selector: 'body',
  attribute: 'class',
  valueDark: 'dark',
  valueLight: '',
  defaultValue: true
})


function toggle(){
  toggleDark()
}

onMounted(() => {
  console.log(isDark.value)
})

const toggleDark = useToggle(isDark)

</script>
<style lang="">
    
</style>