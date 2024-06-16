<template>
  <div class="chips">
    <template v-for="item in tags">
        <ion-chip :class="{checked:item.checked}" @click="item.checked = !item.checked"> {{ item.label }} </ion-chip>
    </template>
    <div style="flex: 1"></div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const tags = ref([
    {
        label:'最近更新',
        checked:false,
    },
    {
        label:'热门',
        checked:false,
    },
    {
        label:'艺术字',
        checked:false,
    },
    {
        label:'图片',
        checked:false,
    },
    {
        label:'印章',
        checked:false,
    },
    {
        label:'艺术字',
        checked:false,
    },
    {
        label:'矢量图',
        checked:false,
    },
    {
        label:'码',
        checked:false,
    },
    {
        label:'我的收藏',
        checked:false,
    },
    {
        label:'我的点赞',
        checked:false,
    },
    {
        label:'我上传的',
        checked:false,
    },
])


</script>

<style scoped>
.chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

ion-chip {
  font-size: 10px;
  min-height: 0;
  transition: all .2s;
}

.checked {
  --background: #6900ff;
  --color: #fff;
}

</style>
