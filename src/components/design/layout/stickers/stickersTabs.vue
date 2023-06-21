<template>
  <div class="designiy-stickers">
    <el-button  type="primary" style="width:100%;margin:10px 0;"> 制作贴纸 <bg-colors-outlined /> </el-button>
    <img
      v-show="isDragging"
      ref="draggingEl"
      id="dragging"
      :style="{ top: draggingElY + 'px', left: draggingElX + 'px' }"
    />

      
    <div class="designiy-stickers-list">
          <el-collapse>
            <el-collapse-item
              v-for="(sticker, index) in webStickers"
              :key="index"
            >
              <template #title>
                <span style="font-size: 12px; color: #666">{{
                  sticker.type
                }}</span>
              </template>
              <div class="designiy-stickers-container">
                <div
                  class="designiy-stickers-item"
                  v-for="(item, index) in sticker.data"
                  title="拖拽来选择该贴图"
                  :key="index"
                  @dragstart="stickerDragstart"
                  @dragend="stickerDragend"
                  draggable="true"
                >
                  <div class="designiy-stickers-item-hover">
                    {{ item.name }}
                  </div>
                  <el-image
                    :src="'api/' + item.source"
                    style="
                      height: 100%;
                      width: 100%;
                      padding: 10px;
                      cursor: grab;
                    "
                    fit="contain"
                  />
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
  </div>
</template>


<script setup>
import { getWebStickers, getMyStickers } from "@/api";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useMouse } from "@vueuse/core";
import { BgColorsOutlined} from "@ant-design/icons-vue";


const { x, y } = useMouse();

const emits = defineEmits(["dragend"]);

const isDragging = ref(false);
const draggingEl = ref();

const draggingElX = computed(() => x.value - draggingEl.value?.width / 2);
const draggingElY = computed(() => y.value - draggingEl.value?.height / 2);

// 开始拖拽
function stickerDragstart(e) {
  draggingEl.value.src = e.target.querySelector('img').src;
  isDragging.value = true;
  e.preventDefault();
}

const currentStickerPage = ref("网络贴纸");

const webStickers = ref()


getWebStickers().then((res) => (webStickers.value = res.data));


// 模拟 dragend 事件
function dragend() {
  if (isDragging.value) {
    emits("dragend",draggingEl)
    isDragging.value = false;
  }
}

onMounted(() => {
  document.addEventListener("mouseup", dragend);
})

onUnmounted(() => {
  document.removeEventListener("mouseup", dragend);
})


</script>


<style lang="less">
.designiy-stickers {
  padding: 10px;
}

.designiy-stickers {
  .el-collapse-item__header {
    border: none;
  }
  .el-collapse {
    border: none;
  }
  .el-collapse-item__wrap {
    border: none;
  }
}

.designiy-stickers-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: auto;
}

.designiy-stickers-item {
  width: 100px;
  height: 60px;
  background: #efefef;
  margin: 5px;
  border-radius: 5px;
  position: relative;
  transition: all 0.1s;
  overflow: hidden;
  &:hover {
    // box-shadow: rgba(3, 102, 214, 0.3) 0px 0px 0px 3px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  }
}

.designiy-stickers-list {
  width: 220px;
}

.designiy-stickers-item:hover{
  .designiy-stickers-item-hover{
    visibility: visible;
  }
}

.designiy-stickers-item-hover {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  user-select: none;
  visibility: hidden;
  cursor: grab;
}

#dragging {
  position: fixed;
  object-fit: scale-down;
  width: 120px;
  height: auto;
  z-index: 10;
  cursor: grabbing;
}
</style>
