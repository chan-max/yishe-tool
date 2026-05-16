<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="params" title="星图参数">
      <operate-form-item>
        <template #name>日期时间</template>
        <template #content>
          <el-date-picker
            v-model="currentOperatingCanvasChild.date"
            type="datetime"
            size="small"
            placeholder="留空表示当前时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DDTHH:mm"
            clearable
            style="width: 100%"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>纬度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.latitude"
            :min="-90"
            :max="90"
            :step="0.1"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>经度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.longitude"
            :min="-180"
            :max="180"
            :step="0.1"
            show-input
            input-size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>显示星座线</template>
        <template #content>
          <el-switch
            v-model="currentOperatingCanvasChild.showConstellations"
            size="small"
          />
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      ></operateItemBackgroundColor>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["params", "basic", "style", "common"]);
</script>

<style scoped></style>
