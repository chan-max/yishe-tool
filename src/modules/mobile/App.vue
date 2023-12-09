<template>
  <div class="content">
    <router-view></router-view>
  </div>
  <m-footer></m-footer>
</template>
<script setup>
import mFooter from './view/footer.vue';

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


</style>
