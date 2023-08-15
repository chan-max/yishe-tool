<template>
  <div class="designiy-header">
    <div class="designiy-header-logo"></div>

    <div class="designiy-header-item">
      撤销
      <font-awesome-icon style="transform: scaleX(-1)" :icon="['fas', 'share']" />
    </div>
    <div class="designiy-header-item">
      <font-awesome-icon :icon="['fas', 'share']" />
      重做
    </div>

    <div style="flex-grow: 1"></div>
    <div class="designiy-header-select-model">
      <el-dropdown @command="modelChange" size="small" split-button>
        <div class="designiy-header-select-model-btn">{{ currentModel.name }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(model, index) in modelList"
              :key="index"
              :command="model"
              >{{ model.name }}
            </el-dropdown-item>
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

    <el-button type="primary" size="small">
      <span style="font-weight: bold">保 存</span>
    </el-button>
  </div>
</template>

<script setup>
import { getBaseModelList, getBaseSkybox } from "@/api/index.ts";
import { ref, defineEmits, defineProps, computed, onMounted } from "vue";
import { CanvasBgColor, CanvasBgOpacity, isDarkMode } from "../store";
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

.designiy-header-logo {
  width: 50px;
  height: 40px;
}

.designiy-header-item {
  color: #eee;
  font-size: 12px;
  margin: 0 7px;
  cursor: pointer;
}
</style>
