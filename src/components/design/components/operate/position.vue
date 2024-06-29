<template>
  <operate-form-item>
    <template #icon> <icon-position></icon-position> </template>
    <template #name> 显示位置 </template>
    <template #content>
      <el-popover width="160" trigger="click">
        <template #reference>
          <el-button size="small" link>{{ positionLabel }}</el-button>
        </template>
        <div>
          <el-row align="middle" justify="center">
            <el-col :span="24">
              <div style="font-weight: bold; padding: 1em 0">优先级自上而下排列</div>
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
                  <el-popover placement="right" :teleported="false">
                    <template #reference>
                      <div class="content">
                        <el-input
                            style="width:60px"
                          size="small"
                          type="number"
                          min="0"
                          step="1"
                          v-model.number="model[item.type].value"
                        ></el-input>
                      </div>
                    </template>
                    <el-row align="middle" justify="end">
                      <el-col :span="24">
                        <el-radio-group v-model="model[item.type].unit" size="small">
                          <el-radio
                            v-for="(u, index) in unitOptions"
                            :value="u.value"
                          >
                            <span style="font-size: 1rem">{{ u.label }}</span>
                          </el-radio>
                        </el-radio-group>
    
                      </el-col>
                    </el-row>
                  </el-popover>
                </div>
              </el-col>
            </template>
          </el-row>
        </div>
      </el-popover>
    </template>
  </operate-form-item>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import iconPosition from "@/components/design/assets/icon/position.svg?component";
import { getPositionInfoFromOptions } from "@/components/design/layout/canvas/helper.tsx";

const visible = ref(true);

const disabled = ref(false);


const model = defineModel({})

const positionLabel = computed(() => {
  return getPositionInfoFromOptions(model.value).label;
});

/*
 像素
 宽度百分比，
 高度百分比
*/

const unitOptions = ref([
  {
    label: "像素值",
    value: "px",
  },
  {
    label: "相对于画布宽的百分比",
    value: "vw",
  },
  {
    label: "相对于画布高的百分比",
    value: "vh",
  },
]);

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

  :deep(.el-input) {
    width: 48px;
    height: 20px;
  }
}

</style>
