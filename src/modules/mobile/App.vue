<template>
  <div class="content">
    <router-view></router-view>
  </div>
  <div v-if="$route.meta.footer" class="footer">
    <div class="footer-item">
      <div class="footer-item-icon">
        <icon-home/>
      </div>
      <div class="footer-item-text">首页</div>
    </div>
    <div class="footer-item">
      <div class="footer-item-icon">
        <icon-workspace/>
      </div>
      <div class="footer-item-text">工作台</div>
      </div>
    <div class="footer-item">
      <div class="footer-item-icon">
        <icon-shop/>
      </div>
      <div class="footer-item-text">网络商城</div>
    </div>
    <div class="footer-item">
      <div class="footer-item-icon">
        <icon-tool/>
      </div>
      <div class="footer-item-text">实用工具</div>
    </div>
    <div class="footer-item">
      <div class="footer-item-icon">
        <icon-me/>
      </div>
      <div class="footer-item-text">我的衣设</div>
    </div>
  </div>
</template>
<script setup>
import {User,Lock,View,Hide} from '@element-plus/icons-vue'
import iconHome from '@/icon/mobile-home.svg?vueComponent'
import iconWorkspace from '@/icon/mobile-workspace.svg?vueComponent'
import iconShop from '@/icon/mobile-shop.svg?vueComponent'
import iconTool from '@/icon/mobile-tool.svg?vueComponent'
import iconMe from '@/icon/mobile-me.svg?vueComponent'

</script>

<style lang="less">
#app {
  width: 100%;
  height: 100%;
  display:flex;
  flex-direction:column;
}

.content{
  flex:1;
}

.footer{
  width:100%;
  height:60px;
  display:flex;
  justify-content:space-around;
}

.footer-item{
  width:20%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:start;
  row-gap:5px;
}

.footer-item-icon{
  svg{
    width:24px;
    height:24px;
  }
}

.footer-item-text{
  font-size:10px;
}
</style>
