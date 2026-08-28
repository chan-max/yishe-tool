<template>
  <operate-form-item>
    <template #icon>
      <icon></icon>
    </template>
    <template #name> {{ label }} </template>
    <template #content>
      <el-popover trigger="click" popper-class="el-popover-operation">
        <template #reference>
          <el-input
            style="width: 72px"
            type="number"
            v-model="model.value"
            size="small"
            min="0"
            step="10"
          >
            <template #suffix>
              <div class="text-[10px] text-muted-foreground">{{ model.unit }}</div>
            </template>
          </el-input>
        </template>
        <el-row align="middle" justify="end">
          <el-col :span="24">
            <el-radio-group v-model="model.unit" size="small">
              <el-radio v-for="u in unitOptions" :value="u.value">
                <span class="text-xs">{{ u.label }}</span>
              </el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </el-popover>
    </template>
  </operate-form-item>
</template>

<script setup lang="tsx">
import icon from "@/components/design/assets/icon/font-size.svg?component";
import { ref, computed } from "vue";
import { canvasStickerOptions,canvasStickerOptionsOnlyChild} from "@/components/design/layout/canvas/index.tsx";

const props = defineProps({
  label: {
    default: "文字大小",
  },
  tooltip: {
    default: "",
  },
});

const model = defineModel({});

const unitOptions = computed(() => {
  return [
    {
      label: `使用当前画布单位(${canvasStickerOptionsOnlyChild.value.width.unit})`,
      value: canvasStickerOptionsOnlyChild.value.width.unit,
    },
    {
      label: "画布宽度百分比",
      value: "vw",
    },
    {
      label: "画布高度度百分比",
      value: "vh",
    },
  ];
});
</script>

<style></style>
