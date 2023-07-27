<template>
  <div class="designiy-header">
    <div class="designiy-header-home"></div>
    <div class="designiy-header-select-skybox">
      <el-dropdown @command="selectSkybox" size="small">
        <div class="designiy-header-select-skybox-btn">天空球</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(skybox, index) in skyboxList"
              :key="index"
              :command="skybox"
              >{{ skybox.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <div class="designiy-header-item">贴图</div>
    <div class="designiy-header-item">艺术字</div>
    <div class="designiy-header-item">自定义图形</div>
    <div class="designiy-header-item">灯光调整</div>
    <div class="designiy-header-select-model">
      <el-dropdown @command="modelChange" size="small" split-button>
        <div class="designiy-header-select-model-btn">{{ currentModel.name }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(model, index) in modelList"
              :key="index"
              :command="model"
              >{{ model.name }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="designiy-header-change-bgcolor">
      <el-color-picker
        show-alpha
        size="small"
        v-model="bgColor"
        color-format="rgb"
        :predefine="predefineColors"
      />
    </div>

    <div style="flex-grow: 1"></div>
    <el-button type="primary" size="small" plain>
      <span style="font-weight: bold">上 传</span>
    </el-button>
    <el-button type="primary" size="small">
      <span style="font-weight: bold">保 存</span>
    </el-button>
  </div>
</template>

<script setup>
import { getBaseModelList, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { CanvasBgColor, CanvasBgOpacity } from "../store";
import Color from "color";
import { Edit, Share, Delete } from "@element-plus/icons-vue";

const emits = defineEmits(["selectModel", "selectSkybox"]);

const props = defineProps([]);

const modelList = ref();
const currentModel = ref({
  name: "选择模型",
});

const skyboxList = ref();
const currentSkybox = ref();

const predefineColors = ref(["#ffffff", "#dddddd", "#333333", "#555555"]);

const bgColor = computed({
  get() {
    let color = Color(CanvasBgColor.value);
    let _color = color.alpha(CanvasBgOpacity.value);
    let __color = `rgba(${_color.rgb().array().join(",")},${_color.valpha})`;
    return __color;
  },
  set(val) {
    val ||= "rgba(0,0,0,0)"; // 模拟透明色
    let color = Color(val);
    CanvasBgOpacity.value = color.valpha;
    CanvasBgColor.value = color.hex();
  },
});

function modelChange(model) {
  currentModel.value = model;
  emits("selectModel", currentModel.value);
}

function selectSkybox(skybox) {
  currentSkybox.value = skybox;
  emits("selectSkybox", currentSkybox.value);
}

getBaseModelList().then((result) => (modelList.value = result.data));
getBaseSkybox().then((result) => (skyboxList.value = result.data));
</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 100%;
  background-color: #fcfcfc;
  display: flex;
  justify-content: start;
  align-items: center;
  box-sizing: border-box;
  padding-right: 20px;
}

.designiy-header-select-model {
  margin: 0 10px;
}

.designiy-header-select-model-btn {
  min-width: 60px;
}

.designiy-header-change-bgcolor {
  color: #555;
  display: flex;
  align-items: center;
  font-size: 12px;
  margin: 0 10px;
}

.designiy-header-select-skybox {
  display: flex;
  align-items: center;
  margin: auto 10px;
  .designiy-header-select-skybox-btn {
    color: #555;
    font-size: 12px;
    line-height: 20px;
    height: 20px;
    outline: none;
  }
}

.designiy-header-home {
  width: 10px;
}

.designiy-header-item {
  color: #555;
  font-size: 12px;
  line-height: 20px;
  height: 20px;
  margin: 0 10px;
}
</style>
