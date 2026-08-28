<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-14 19:04:03
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-18 09:13:42
 * @FilePath: /yishe/src/components/design/layout/subHeaderMenu/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
  <div class="designiy-sub-header">
    <div class="text-xs font-medium text-muted-foreground select-none">
      {{ isEdit ? "编辑" : "新建" }}
    </div>

    <div class="flex items-center gap-1">
      <Button variant="ghost" size="xs" class="flex items-center gap-1">
        <icon-prev class="designiy-sub-header-icon"></icon-prev>
        <span>撤销</span>
      </Button>

      <Button variant="ghost" size="xs" class="flex items-center gap-1">
        <icon-prev
          style="transform: rotateY(180deg)"
          class="designiy-sub-header-icon"
        ></icon-prev>
        <span>重做</span>
      </Button>
    </div>

    <div class="flex-1"></div>

    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="icon-sm" @click="$emit('takephoto')">
          <icon-camera class="w-4 h-4"></icon-camera>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">截屏</TooltipContent>
    </Tooltip>

    <Separator orientation="vertical" class="h-4" />

    <online-point :online="online"></online-point>
  </div>
</template>

<script setup>
import { ref } from "vue";
import headerMenuDropdown from "../headerMenuDropdown/index.vue";
import onlinePoint from "../../components/onlinePoint.vue";
import {
  isDarkMode,
  online,
  isEdit,
  currentEditingModelInfo,
  currentModelController,
} from "../../store";
import iconPrev from "@/icon/design/prev.svg?component";
import iconCamera from "@/icon/camera.svg?component";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
</script>

<style lang="less" scoped>
.designiy-sub-header {
  width: 100%;
  height: 100%;
  background: var(--1s-surface-background);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 16px;
  column-gap: 12px;
  border-bottom: 1px solid var(--1s-divider-color);
}

.designiy-sub-header-icon {
  width: 13px;
  height: 13px;
}
</style>
