<template>
  <operate-form-item>
    <template #icon> <icon-position></icon-position> </template>
    <template #name> 显示位置 </template>
    <template #content>
      <el-popover width="auto" trigger="click" popper-class="el-popover-operation">
        <template #reference>
          <el-button size="small" link>{{ positionLabel }}</el-button>
        </template>
        <div>
          <el-row v-if="active == 'params'" align="middle" justify="center" style="width:160px;row-gap:.2rem;">
            <el-col :span="24">
              <div class="flex items-center justify-between">
                <span style="font-weight: bold; padding: 1em 0">优先级自上而下排列 </span>
              </div>
            </el-col>
            <el-col :span="8">
              <div>整体居中</div>
            </el-col>
            <el-col :span="16">
              <div class="content">
                <el-switch size="small" v-model="model.center"></el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <div>垂直居中</div>
            </el-col>
            <el-col :span="16">
              <div class="content">
                <el-switch size="small" v-model="model.verticalCenter"></el-switch>
              </div>
            </el-col>
            <el-col :span="8">
              <div>水平居中</div>
            </el-col>
            <el-col :span="16">
              <div class="content">
                <el-switch size="small" v-model="model.horizontalCenter"></el-switch>
              </div>
            </el-col>
            <template v-for="item in positionOptions">
              <el-col :span="8">
                <div>{{ item.label }}</div>
              </el-col>
              <el-col :span="16">
                <div>
                  <el-popover placement="right" :teleported="false" popper-class="el-popover-operation">
                    <template #reference>
                      <div class="content">
                        <el-input style="width:80px" size="small" min="0" step="1"
                          v-model.number="model[item.type].value">
                          <template #suffix>
                            <span style="font-size: 1rem;">
                              {{ model[item.type].unit }}
                            </span>
                          </template>
                        </el-input>
                      </div>
                    </template>
                    <el-row align="middle" justify="end">
                      <el-col :span="24">
                        <el-radio-group v-model="model[item.type].unit" size="small">
                          <el-radio v-for="(u, index) in unitOptions" :value="u.value">
                            <span style="font-size: 1rem">{{ u.label }}</span>
                          </el-radio>
                        </el-radio-group>
                      </el-col>
                    </el-row>
                  </el-popover>
                </div>
              </el-col>
            </template>
            <el-col :span="24">
              <div style="height:30px;" class="flex items-center">
                <el-button @click="active = 'drag'" class="w-full" size="small">
                  <AimOutlined />手动调整
                </el-button>
              </div>
            </el-col>
          </el-row>

          <div v-if="active == 'drag'">
            <dragger ref="draggerRef" v-bind="draggerAttrs" v-model="draggerValue" @init="draggerInit"
              @drag="draggerDrag">
            </dragger>

            <div class="flex  w-full items-center" style="margin-top:1rem;">
              <el-button link @click="active = 'params'">
                <LeftOutlined />返回
              </el-button>
              <el-button @click="reset" link>
                <RedoOutlined></RedoOutlined>
                重置位置
              </el-button>
            </div>

          </div>
        </div>
      </el-popover>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import iconPosition from "@/components/design/assets/icon/position.svg?component";
import { getPositionInfoFromOptions, getPositionLabelFromOptions, formatSizeOptionToPixelValue } from "@/components/design/layout/canvas/helper.tsx";
import { canvasStickerOptions, currentOperatingCanvasChild } from "@/components/design/layout/canvas/index.tsx";
import dragger from './dragger.vue'
import Utils from '@/common/utils'

import { Pointer } from '@element-plus/icons-vue'
import { AimOutlined, LeftOutlined, RedoOutlined } from '@ant-design/icons-vue'

const model = defineModel({
  default: {} as any
})


const active = ref('params')

const positionLabel = computed(() => {
  return getPositionLabelFromOptions(model.value);
});

/*
 像素
 宽度百分比，
 高度百分比
*/

const draggerRef = ref()

function reset() {
  draggerRef.value.reset()
}

const draggerValue = ref({
  x: 0,
  y: 0
})

const draggerAttrs = computed(() => {
  // 计算 宽高，子元素宽高 缩放尺寸
  const containerWidth = formatSizeOptionToPixelValue({
    value: canvasStickerOptions.value.width,
    unit: canvasStickerOptions.value.unit
  })

  const containerHeight = formatSizeOptionToPixelValue({
    value: canvasStickerOptions.value.height,
    unit: canvasStickerOptions.value.unit
  })

  // 控制拖拽板的大小
  let scale = 240 / Math.max(containerWidth, containerHeight)

  return {
    scale: scale,
    containerWidth: containerWidth,
    containerHeight: containerHeight,
    targetWidth: currentOperatingCanvasChild.value.targetComputedWidth,
    targetHeight: currentOperatingCanvasChild.value.targetComputedHeight,
  }
})


function draggerInit() {
  // 确认使用拖拽，清理参数 状态，

  // 初始化需要重新计算拖拽的长度

  model.value.center = false
  model.value.horizontalCenter = false
  model.value.verticalCenter = false
  model.value.top.value = 0
  model.value.left.value = 0
}


// 实时拖拽触发
function draggerDrag(pos) {
  let { x, y } = pos

  var top, left

  top = Number(top)
  left = Number(left)

  // 强制把单位调整为画布单位
  let canvasUnit = canvasStickerOptions.value.unit

  if (canvasUnit == 'px') {
    top = y
    left = x
  }

  if (canvasUnit == 'cm') {
    top = Utils.pxToCM(y)
    left = Utils.pxToCM(x)
  }


  if (canvasUnit == 'mm') {
    top = Utils.pxToMM(y)
    left = Utils.pxToMM(x)
  }


  if (canvasUnit == 'in') {
    top = Utils.pxToIn(y)
    left = Utils.pxToIn(x)
  }


  model.value.top.value = top
  model.value.left.value = left
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
  ]
});

const positionOptions = ref([
  {
    label: "距离顶部",
    type: "top",
  },
  {
    label: "距离左侧",
    type: "left",
  },
  {
    label: "距离底部",
    type: "bottom",
  },
  {
    label: "距离右侧",
    type: "right",
  },
]);
</script>

<style scoped lang="less">
.content {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: end;
}
</style>
