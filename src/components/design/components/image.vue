<template>
  <div class="img-container">
    <el-image class="el-img" v-bind="$attrs" :fit="fit || 'contain'" :lazy="lazy" @load="load($event, info)"
      style="width: 100%; height: 100%" :style="{ padding }">
      <template #placeholder>
        <div class="el-img_loading"></div>
      </template>
      <template #error>
        <div class="el-img_error">
          <el-icon style="color: #aaa">
            <Picture />
          </el-icon>
        </div>
      </template>
    </el-image>
  </div>
</template>
<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import { Picture, FolderOpened, Search, Operation } from "@element-plus/icons-vue";

const emits = defineEmits(['load'])

const props = defineProps({
  // 是否可拖拽
  padding: {
    default: "0",
  },
  info: {
    default: {}
  },
  fit: {
    default: 'contain'
  },
  lazy: {
    default: false
  },
  hideloading: {
    default: false
  }
});

/*
 初始化可拖拽
*/

function load(e) {
  emits('load', e.target)
}
</script>
<style lang="less" scoped>
.img-container {
  width: 100%;
  height: 100%;
}

.el-img {
  overflow: hidden;
  cursor: pointer;
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  display: block;

  // &:hover {
  //   box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  // }

  &_loading {
    width: 100%;
    height: 100%;
    padding: 4rem;
    list-style: none;
    background-image: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
    background-size: 400% 100%;
    background-position: 100% 50%;
    animation: skeleton-loading 1.4s ease infinite;
  }

  &_error {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

@keyframes rolling {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
