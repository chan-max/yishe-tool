<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> 文字阴影 </template>
    <template #content>
      <div>
        <el-button size="small"> 选择阴影 </el-button>
        <el-popover
          width="800"
          placement="bottom"
          :visible="showPopover"
          popper-class="el-popover-operation"
        >
          <template #reference>
            <el-button @click="click" size="small" link>
              <el-icon size="16">
                <Setting />
              </el-icon>
            </el-button>
          </template>
          <template #default>
            <el-row
              align="middle"
              justify="space-around"
              style="row-gap: 0.8rem"
              :gutter="24"
            >
              <template v-for="(item, index) in model">
                <el-col :span="24">
                  <div class="flex items-center justify-between" style="column-gap: 1rem">
                    <span> {{ index + 1 }}: </span>
                    水平偏移:
                    <size-input
                      :unit-options="unitOptions"
                      v-model="model[index].horizontal.value"
                      v-model:unit="model[index].horizontal.unit"
                    ></size-input>
                    垂直偏移:
                    <size-input
                      :unit-options="unitOptions"
                      v-model="model[index].vertical.value"
                      v-model:unit="model[index].horizontal.unit"
                    ></size-input>
                    模糊半径:
                    <size-input
                      :unit-options="unitOptions"
                      v-model="model[index].blur.value"
                      v-model:unit="model[index].horizontal.unit"
                    ></size-input>
                    颜色:
                    <color-picker type="pure" v-model="model[index].color"></color-picker>
                    隐藏：
                    <el-switch size="small" v-model="model[index].disabled"></el-switch>
                    <el-button type="danger" plain size="small" @click="remove(index)">
                      移除
                    </el-button>
                  </div>
                </el-col>
              </template>
              <el-col :span="24">
                <el-button-group class="w-full" style="display: flex">
                  <el-button @click="clear" size="small"> 清空 </el-button>
                  <el-button @click="addShadow" size="small" style="flex: 1">
                    添加阴影
                  </el-button>
                </el-button-group>
              </el-col>
            </el-row>
          </template>
        </el-popover>
      </div>
    </template>
  </operate-form-item>
</template>

<script setup lang="tsx">
import icon from "@/components/design/assets/icon/text-shadow.svg?component";
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { canvasStickerOptions } from "@/components/design/layout/canvas/index.tsx";
import sizeInput from "../sizeInput.vue";
import colorPicker from "@/components/design/components/colorPicker/colorPicker.vue";
import {
  getPositionInfoFromOptions,
  formatToNativeSizeOption,
  parseTextShadowOptionsToCSS,
} from "@/components/design/layout/canvas/helper.tsx";
import { Setting } from "@element-plus/icons-vue";

const model = defineModel({
  default: [],
});

const showPopover = ref(false);

function click() {
  console.log("click");
  showPopover.value = !showPopover.value;
}

const props = defineProps({
  tooltip: {
    default: "",
  },
});

function addShadow() {
  const unit = canvasStickerOptions.value.unit;

  model.value.push({
    horizontal: {
      unit: unit,
      value: 5,
    },
    vertical: {
      unit: unit,
      value: 5,
    },
    blur: {
      unit: unit,
      value: 5,
    },
    color: {
      color: "#fff",
      type: "pure",
    },
  });
}

function remove(index) {
  model.value.splice(index, 1);
}

function clear() {
  model.value = [];
}

const unitOptions = computed(() => {
  return [
    {
      label: `使用当前画布单位(${canvasStickerOptions.value.unit})`,
      value: canvasStickerOptions.value.unit,
    },
    {
      label: "相对于画布宽的百分比",
      value: "vw",
    },
    {
      label: "相对于画布高的百分比",
      value: "vh",
    },
  ];
});
</script>

<style></style>
