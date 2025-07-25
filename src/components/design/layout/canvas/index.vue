<template>
  <div class="container flex flex-col items-center">
    <div
      ref="canvasContainerRef"
      @mousemove="mousemove"
      v-if="!showMainCanvas"
      v-loading="renderingLoading"
      v-bind="loadingOptions"
      class="canvas-container"
    >
      <canvass></canvass>
      <drag-tip v-if="showDragTip"></drag-tip>
      <div class="canvas-container-bottom-menu">
        <div style="flex: 1"></div>
        <el-tooltip
          :hide-after="0"
          content="小画布始终展示等比缩放的尺寸，大画布可以显示真实尺寸"
        >
          <el-button
            @click="showMainCanvas = true"
            :icon="FullScreen"
            type="info"
            text
            bg
            round
            size="small"
          >
            <span>大画布显示</span>
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div
      class="flex"
      style="width: 100%; padding: 10px; padding-top: 20px; column-gap: 10px"
    >
      <el-button plain link @click="showUploadModal = true">
        <CloudUploadOutlined style="font-size: 1.2em; margin-right: 4px" />
        上传
      </el-button>

      <a-dropdown arrow placement="bottom">
        <div>
          <el-button link plain>
            <LinkOutlined style="font-size: 1.2em; margin-right: 4px" />
            导出 PNG
          </el-button>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="exportPng"> 导出原始图 </a-menu-item>
            <a-menu-item @click="exportTrimmedPng"> 自动去除空白边框 </a-menu-item>
            <a-menu-item @click="exportIco"> 导出ico </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <a-dropdown arrow placement="bottom">
        <div>
          <el-button link plain> 更多 </el-button>
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item @click="removeAllChildren"> 移除所有子元素 </a-menu-item>
            <a-menu-item @click="consoleStikcerOptions">
              在控制台打印贴纸信息
            </a-menu-item>
            <a-menu-item @click="copyCurrentCanvasChild"> 复制当前元素 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <div style="flex: 1"></div>
      <div>
        <el-button link @click="showOfficialTemplate">
          <span>模版</span>
        </el-button>
        <addPopover>
          <el-button type="primary" link>
            <span>添加元素</span>
          </el-button>
        </addPopover>
      </div>
    </div>

    <div class="flex" style="width: 100%; padding: 10px; column-gap: 10px">
      <div style="flex: 1"></div>
      <el-button size="small" @click="genSticker" link>
        {{ shouldUpdateCanvasSticker ? "点击更新贴纸" : "贴纸已更新" }}
      </el-button>
    </div>

    <div style="width: 100%; padding: 1rem">
      <el-select v-model="currentOperatingCanvasChildId">
        <template #label="{ label }">
          <div style="font-size: 1rem">
            {{ canvasChildLabelMap[currentOperatingCanvasChild.type] }}
          </div>
        </template>

        <template v-for="(item, index) in canvasStickerOptions.children">
          <el-option
            class="canvas-child-select-option"
            :value="item.id"
            :label="canvasChildLabelMap[item.type]"
          >
            <div
              style="display: flex; align-items: center; font-size: 1rem; height: 100%"
              @mouseenter="optionMouseenter(item)"
              @mouseleave="optionMouseleave(item)"
            >
              {{ canvasChildLabelMap[item.type] }}
              <div style="flex: 1"></div>
              <el-button
                v-if="!item.undeletable"
                link
                type="danger"
                @click="remove(item.id)"
              >
                <el-icon size="14">
                  <CircleCloseFilled></CircleCloseFilled>
                </el-icon>
              </el-button>
            </div>
          </el-option>
        </template>
      </el-select>
    </div>
    <div class="operate">
      <operateLayout></operateLayout>
    </div>
  </div>

  <a-modal
    v-model:open="showUploadModal"
    :centered="true"
    :destroyOnClose="true"
    width="540px"
    title="保存该贴纸"
    okText="保存"
    cancelText="取消"
    @ok="doUpload"
    :confirmLoading="submitLoading"
  >
    <el-form
      style="padding: 12px"
      label-width="80px"
      :inline-message="false"
      :show-message="false"
      label-position="left"
    >
      <el-form-item label="贴纸名称：">
        <el-input v-model="editForm.name" placeholder="贴纸名称"></el-input>
      </el-form-item>
      <el-form-item label="贴纸描述:">
        <el-input
          type="textarea"
          v-model="editForm.description"
          placeholder="贴纸描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="关键字:">
        <tagsInput
          v-model="editForm.keywords"
          :autocomplete-tags="stickerAutoplacementTags"
          :autocomplete-width="400"
          autocompletePlacement="bottom"
        ></tagsInput>
      </el-form-item>
      <el-form-item label="模版分类:">
        <el-select v-model="editForm.group" clearable>
          <el-option
            v-for="item in officialStickerTemplateOptions"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="保存到草稿箱:">
        <a-switch
          v-model:checked="editForm.isDraft"
          checked-children="是"
          un-checked-children="否"
        />
      </el-form-item>
      <!-- <el-form-item label="是否共享:">
        <a-switch
          v-model:checked="editForm.isPublic"
          checked-children="公开"
          un-checked-children="私密"
        />
      </el-form-item> -->
    </el-form>
  </a-modal>

  <officialTemplateModal></officialTemplateModal>
  <ChildViewHelperComponent></ChildViewHelperComponent>
</template>

<script setup lang="tsx">
import {
  CanvasController,
  canvasStickerOptions,
  addCanvasChild,
  removeCavnasChild,
  CanvasChildType,
  currentOperatingCanvasChildId,
  currentOperatingCanvasChild,
  showMainCanvas,
  canvasChildLabelMap,
  renderingLoading,
} from "./index.tsx";

import operateLayout from "./operateLayout/index.vue";
import { onMounted, ref, computed, watch, reactive, watchEffect, nextTick } from "vue";

import {
  Delete,
  Plus,
  DeleteFilled,
  CircleCloseFilled,
  Link,
  CirclePlusFilled,
  FullScreen,
} from "@element-plus/icons-vue";
import {
  StarOutlined,
  StarFilled,
  StarTwoTone,
  CloudUploadOutlined,
  LinkOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons-vue";
import { useLoadingOptions } from "@/components/loading/index.tsx";
import addPopover from "./addPopover.vue";
import dragTip from "./dragTip.vue";
import { useElementHover, useDebounceFn } from "@vueuse/core";
import Api from "@/api";
import { message } from "ant-design-vue";
import { useLoginStatusStore } from "@/store/stores/login";
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import { stickerAutoplacementTags } from "@/components/design/components/tagsInput/index.ts";
import Utils from "@/common/utils";
import officialTemplateModal from "./officialTemplateModal/index.vue";
import {
  currentFocusingStickerId,
  ChildViewHelperComponent,
} from "@/components/design/layout/canvas/components/childViewHelper/index";

import { officialStickerTemplateOptions } from "./officialTemplateModal";
import { createDraft } from "@/api";

const loginStore = useLoginStatusStore();

const canvasContainerRef = ref();

const showDragTip = computed(() => {
  return isHovered.value && !mouseMovedRecent.value;
});

const isHovered = useElementHover(canvasContainerRef, {
  delayEnter: 0,
});

// 鼠标最近是否移动
const mouseMovedRecent = ref(false);
const mouseMoveTimer = ref();
const mousemove = function () {
  mouseMovedRecent.value = true;
  clearTimeout(mouseMoveTimer.value);
  mouseMoveTimer.value = setTimeout(() => {
    mouseMovedRecent.value = false;
  }, 3000);
};

const loadingOptions = useLoadingOptions({});

let canvasController = new CanvasController({
  max: 320,
});

const shouldUpdateCanvasSticker = computed(() => {
  return canvasController.shouldUpdateCanvasSticker.value;
});

let canvass = canvasController.getRender();

function exportPng() {
  canvasController.downloadPng();
}

/* 导出去除多余空白的图片 */
function exportTrimmedPng() {
  canvasController.downloadTrimmedPng();
}

function exportIco() {
  canvasController.downloadIco();
}

function remove(id) {
  removeCavnasChild(id);
}

function removeAllChildren() {
  // 除了画布，其他全移除
  canvasStickerOptions.value.children = [canvasStickerOptions.value.children[0]];
}

/**
 * @method 在控制台打印当前贴纸配置信息
 */
function consoleStikcerOptions() {
  console.log(JSON.parse(JSON.stringify(canvasStickerOptions.value)));
}

/**
 * @method 展示设计模板模版
 */

import { showOfficialTempalteModal } from "./officialTemplateModal";
function showOfficialTemplate() {
  showOfficialTempalteModal.value = true;
}

/**
 * @method 处理保存逻辑
 */

const showUploadModal = ref(false);
const submitLoading = ref(false);

const editForm = ref({
  name: "",
  description: "",
  keywords: [],
  group: "",
  isPublic: false,
  isDraft: true,
});

async function doUpload() {
  submitLoading.value = true;

  try {
    const file = await canvasController.toPngFile();

    const cos = await Api.uploadToCOS({
      file: file,
    });

    if (editForm.value.isDraft) {
      // 保存到草稿箱
      await createDraft({
        url: cos.url,
        name: editForm.value.name,
        description: editForm.value.description,
        keywords: editForm.value.keywords.join(","),
        group: editForm.value.group,
        meta: {
          data: canvasStickerOptions.value,
        },
        updateTime: new Date()
      });
      message.success("已保存到草稿箱");
    } else {
      // 正常保存
      await Api.createSticker({
        url: cos.url,
        ...editForm.value,
        keywords: editForm.value.keywords.join(","),
        meta: {
          data: canvasStickerOptions.value,
        },
        uploaderId: loginStore.isLogin ? loginStore.userInfo.id : null,
      });
      message.success("保存成功");
    }

    submitLoading.value = false;
    showUploadModal.value = false;
  } catch (e) {
    submitLoading.value = false;
    message.error("保存失败");
  }
}

/**
 * @method 子元素鼠标覆盖事件
 */

function optionMouseenter(item) {
  currentFocusingStickerId.value = item.id;
}

function optionMouseleave(item) {
  if (item.id == currentFocusingStickerId.value) {
    currentFocusingStickerId.value = null;
  }
}

/**
 * 获取贴纸的主题色
 */
async function getCanvasStickerColor() {
  let colors = await canvasController.getPalette();
}

/**
 * @methods 复制当前操作的子画布元素
 */
function copyCurrentCanvasChild() {
  let copy = Utils.clone(currentOperatingCanvasChild.value);
  addCanvasChild(copy);
}

/**
 * @methods 手动生成贴纸
 */
function genSticker() {
  canvasController.activeUpdateRenderingCanvas();
}
</script>

<style lang="less" scoped>
:deep(.el-form-item) {
  margin-bottom: 8px;
}

.container {
  width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.canvas-container {
  width: 320px;
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  position: relative;
  overflow: hidden;

  // &:hover {

  //     .canvas-container-bottom-menu {
  //         bottom: 0px;
  //     }
  // }
}

.canvas-container-bottom-menu {
  width: 100%;
  height: 48px;
  position: fixed;
  padding: 0 1rem;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
  position: absolute;
  // bottom: -48px;
  bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
}

.operate {
  flex: 1;
  width: 100%;
  overflow: auto;
}

.title {
  font-size: 1rem;
  font-weight: bold;
}

.label {
  line-height: 22px;
}
</style>
