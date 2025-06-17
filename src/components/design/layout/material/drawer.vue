<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-07 08:55:24
 * @FilePath: /1s/src/components/design/layout/material/drawer.vue
 * @Description: 材质选择drawer组件
-->
<template>
  <el-drawer 
    v-model="viewDisplayController.showMaterialModal" 
    :modal="true" 
    :size="420" 
    :with-header="true" 
    :append-to-body="true"
    :wrapper-closable="true"
    modal-class="bg-transparent"
    title="材质选择"
    direction="ltr"
    :before-close="handleClose"
  >
    <div class="material-drawer-content">
      <div
        style="padding: 0 12px; height: 64px; width: 100%"
        class="flex justify-between items-center"
      >
        <el-input style="width: 100%" placeholder="搜索材质" v-model="search"></el-input>
      </div>
      
      <div
        v-if="currentModelController.state.material.textureInfo"
        style="padding: 0 12px; margin-bottom: 12px"
        class="flex items-center"
      >
        <span style="margin-right: 8px; font-size: 14px; color: #666;">正在使用:</span>
        <s1-img
          :src="currentModelController.state?.material.textureInfo?.url"
          style="width: 32px; height: 32px; margin-right: 8px"
          fit="cover"
        ></s1-img>
        <el-button @click="removeMaterial" size="small" type="danger" plain> 移除 </el-button>
      </div>
      
      <div style="height: calc(100% - 64px - 44px - 60px); overflow: auto; padding: 12px">
        <el-row :gutter="8">
          <template v-for="(item, index) in list">
            <el-col :span="12" style="margin: 8px 0">
              <el-popover
                placement="right"
                :width="300"
                trigger="hover"
                popper-class="material-popover"
                :visible="viewDisplayController.showMaterialModal && popoverVisible[index]"
                @show="showPopover(index)"
                @hide="hidePopover(index)"
              >
                <template #reference>
                  <div @click="useMaterial(item)" :draggable="false" class="material-item">
                    <s1-img
                      :src="item.url"
                      style="background: #f7f7f7; height: 120px; border-radius: 8px"
                    ></s1-img>
                  </div>
                </template>
                
                <!-- Popover内容 -->
                <div class="material-popover-content">
                  <div class="material-preview">
                    <s1-img
                      :src="item.url"
                      style="width: 200px; height: 200px; border-radius: 8px; background: #f7f7f7"
                      fit="cover"
                    ></s1-img>
                  </div>
                  <div class="material-info">
                    <h4 style="margin: 8px 0; color: #333;">{{ item.name || '未命名材质' }}</h4>
                    <p style="margin: 4px 0; color: #666; font-size: 12px;">
                      {{ item.description || '暂无描述' }}
                    </p>
                    <div style="margin-top: 12px;">
                      <el-button @click="useMaterial(item)" type="primary" size="small" round>
                        使用该材质
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-popover>
            </el-col>
          </template>
        </el-row>
        
        <div v-if="loading" style="text-align: center; padding: 20px; color: #999;">
          加载中...
        </div>
        
        <div v-if="isEmpty" style="text-align: center; padding: 20px; color: #999;">
          暂无材质
        </div>
      </div>
      
      <!-- 分页组件 -->
      <div style="padding: 12px; border-top: 1px solid #eee;">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[12, 24, 36, 48]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          small
        />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { viewDisplayController, currentModelController } from "@/components/design/store";
import Api from "@/api";
import Utils from "@/common/utils";

let search = ref("");

// 分页相关状态
const currentPage = ref(1);
const pageSize = ref(12);
const total = ref(0);
const list = ref([]);
const loading = ref(false);
const isEmpty = ref(false);

// Popover显示状态管理
const popoverVisible = ref({});

// 显示popover
function showPopover(index: number) {
  popoverVisible.value[index] = true;
}

// 隐藏popover
function hidePopover(index: number) {
  popoverVisible.value[index] = false;
}

// 获取列表数据
async function getList() {
  loading.value = true;
  try {
    const res = await Api.getStickerList({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      isTexture: true,
    });
    list.value = res.list || [];
    total.value = res.total || 0;
    isEmpty.value = list.value.length === 0;
  } catch (error) {
    console.error('获取材质列表失败:', error);
    list.value = [];
    total.value = 0;
    isEmpty.value = true;
  } finally {
    loading.value = false;
  }
}

// 处理页码改变
function handleCurrentChange(val: number) {
  currentPage.value = val;
  getList();
}

// 处理每页条数改变
function handleSizeChange(val: number) {
  pageSize.value = val;
  currentPage.value = 1;
  getList();
}

// 使用该材质
function useMaterial(item) {
  currentModelController.value.state.material.textureInfo = item;
  // 关闭材质选择drawer
  viewDisplayController.value.showMaterialModal = false;
}

function removeMaterial() {
  // 移除当前材质
  currentModelController.value.state.material.textureInfo = null;
}

function handleClose() {
  // 关闭所有popover
  popoverVisible.value = {};
  // 关闭drawer
  viewDisplayController.value.showMaterialModal = false;
}

// 监听drawer状态变化，关闭时隐藏所有popover
watch(() => viewDisplayController.value.showMaterialModal, (newVal) => {
  if (!newVal) {
    popoverVisible.value = {};
  }
});

// 监听搜索变化
watch(search, () => {
  currentPage.value = 1;
  getList();
});

// 组件挂载时获取数据
onMounted(() => {
  getList();
});
</script>

<style scoped lang="less">
.material-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.material-item {
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

// Popover样式
:deep(.material-popover) {
  z-index: 5000 !important;
}

.material-popover-content {
  padding: 0;
  
  .material-preview {
    text-align: center;
    margin-bottom: 12px;
  }
  
  .material-info {
    h4 {
      margin: 8px 0;
      color: #333;
      font-size: 14px;
    }
    
    p {
      margin: 4px 0;
      color: #666;
      font-size: 12px;
      line-height: 1.4;
    }
  }
}
</style> 