<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="basic" title="OpenType 文字">
      <operate-form-item>
        <template #name>文字内容</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.text"
            type="textarea"
            :rows="3"
            resize="vertical"
            spellcheck="false"
            placeholder="请输入文字内容"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字体URL</template>
        <template #content>
          <el-input
            v-model="currentOperatingCanvasChild.fontUrl"
            type="textarea"
            :rows="3"
            resize="vertical"
            spellcheck="false"
            placeholder="请输入字体文件URL (.ttf, .otf, .woff, .woff2)"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字号</template>
        <template #content>
          <el-input-number
            v-model="currentOperatingCanvasChild.fontSize"
            :min="1"
            :max="1000"
            :step="1"
            size="small"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>填充色</template>
        <template #content>
          <el-color-picker
            v-model="currentOperatingCanvasChild.fillColor"
            show-alpha
            size="small"
          />
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="size" title="尺寸">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
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
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["basic", "size", "common"]);
</script>
