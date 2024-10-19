<template>
  <div class="fixed" style="height: calc(100vh - 160px); bottom: 24px; right: 12px">
    <div v-if="!decals.length" style="text-align: center">无贴纸</div>

    <div style="position: relative; height: calc(100% - 64px)">
      <div class="to-top btn" v-show="!arrivedState.top" @click="goTop">
        <el-icon>
          <ArrowUpBold />
        </el-icon>
      </div>
      <div class="to-bottom btn" v-show="!arrivedState.bottom" @click="goBottom">
        <el-icon>
          <ArrowDownBold />
        </el-icon>
      </div>
      <div
        class="scroller flex flex-col hide-scrollbar items-center"
        ref="scrollRef"
        :class="{
          'gradient-top': !arrivedState.top && arrivedState.bottom,
          'gradient-bottom': !arrivedState.bottom && arrivedState.top,
          'gradient-both': !arrivedState.bottom && !arrivedState.top,
        }"
        style="height: 100%; overflow: auto"
      >
        <template v-for="item in decals">
          <div class="item" @click="decalClick(item)">
            <el-tooltip content="该贴纸还未上传" placement="top">
              <el-button
                v-if="item.state.isLocalResource"
                @click="unUpload"
                style="position: absolute; top: 4px; right: 4px; z-index: 99"
                link
              >
                <s1-icon name="un-upload" size="16"></s1-icon>
              </el-button>
            </el-tooltip>
            <s1-image :src="item.state.url"></s1-image>
          </div>
        </template>
      </div>
    </div>

    <div style="height: 64px" class="flex items-center justify-center">
      <el-button :icon="CloseBold" circle @click="showDecalList = false"></el-button>
    </div>
  </div>
</template>
<script setup>
import {
  currentOperatingBaseModelInfo,
  currentModelController,
  showDecalList,
  currentOperatingDecalController,
  showDecalControl,
} from "../../store";
import { computed, reactive } from "vue";
import { useScroll } from "@vueuse/core";
import {
  Plus,
  Close,
  ArrowUpBold,
  ArrowDownBold,
  CloseBold,
} from "@element-plus/icons-vue";
import unUploadIcon from "@/icon/un-upload.svg?component";

const scrollRef = ref();

const { x, y, isScrolling, arrivedState, directions } = useScroll(scrollRef, {
  behavior: "smooth",
});

function goTop() {
  y.value = 0;
}

function goBottom() {
  y.value = 999999;
}

function decalClick(item) {
  currentOperatingDecalController.value = item;
  showDecalControl.value = true;
}

function unUpload() {}

const decals = computed(() => {
  return currentModelController.value.decalControllers;
});
</script>
<style lang="less" scoped>
.scroller {
  row-gap: 12px;
  min-width: 120px;
  padding: 1rem;
}

.btn {
  position: absolute;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.15) 0 0 16px;
  height: 24px;
  width: 64px;
  border-radius: 8px;
  z-index: 10;
  cursor: pointer;
  left: calc(50% - 32px);

  &:hover {
    background-color: #ddd;
  }
}

.to-top {
  top: 0;
}

.to-bottom {
  bottom: 0;
}

.item {
  height: 108px;
  width: 108px;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.06);
  background-color: #fff;
  border-radius: 8px;
  border: 2px solid #eee;
  transition: all 0.3s;
  position: relative;

  &:hover {
    border-color: #aaa;
  }
}

// 竖向两端 渐变
.gradient-both {
  mask-image: linear-gradient(
    0deg,
    transparent 0%,
    transparent 28px,
    rgba(0, 0, 0) 70px,
    rgba(0, 0, 0) calc(100% - 70px),
    transparent calc(100% - 28px)
  );
}

.gradient-top {
  mask-image: linear-gradient(
    0deg,
    rgba(0, 0, 0) 70px,
    rgba(0, 0, 0) calc(100% - 70px),
    transparent calc(100% - 28px)
  );
}

.gradient-bottom {
  mask-image: linear-gradient(0deg, transparent 0%, transparent 28px, rgba(0, 0, 0) 70px);
}

.gradient-top {
}
</style>
