<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="pattern" title="三角纹理">
      <operate-form-item>
        <template #name>单元格大小</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.cellSize"
            size="small"
            :min="10"
            :max="200"
            :step="5"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>随机度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.variance"
            :min="0"
            :max="1"
            :step="0.05"
            size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>种子</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.seed"
            size="small"
            placeholder="留空随机"
            clearable
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>X轴颜色</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.xColors"
            size="small"
            placeholder="random 或 #ff0000,#00ff00"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>Y轴颜色</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.yColors"
            size="small"
            placeholder="random 或 #ff0000,#00ff00"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>描边宽度</template>
        <template #content>
          <el-slider
            v-model="currentOperatingCanvasChild.strokeWidth"
            :min="0"
            :max="5"
            :step="0.1"
            size="small"
          />
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>填充</template>
        <template #content>
          <el-switch v-model="currentOperatingCanvasChild.fill" />
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />
    </el-collapse-item>

    <el-collapse-item name="style" title="样式">
      <operateItemBackgroundColor
        v-model="currentOperatingCanvasChild.backgroundColor"
      />
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["pattern", "basic", "style", "common"]);
</script>
