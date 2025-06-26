<template>
  <a-modal
    v-model:open="visible"
    :centered="true"
    :destroyOnClose="true"
    width="800px"
    title="选择句子"
    :footer="null"
  >
    <div class="sentence-selector">
      <!-- 搜索框 -->
      <div class="mb-4">
        <el-input
          v-model="searchText"
          placeholder="搜索句子内容"
          clearable
          @input="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 句子列表 -->
      <div class="sentence-list max-h-[400px] overflow-y-auto">
        <div
          v-for="item in filteredList"
          :key="item.id"
          class="sentence-item p-3 border border-gray-200 rounded-lg mb-2 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
          @click="selectSentence(item)"
        >
          <div class="text-lg font-medium text-gray-800 mb-1">
            {{ item.content }}
          </div>
          <div v-if="item.description" class="text-sm text-gray-600">
            {{ item.description }}
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30]"
          :total="total"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import Api from '@/api';
import { message } from 'ant-design-vue';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  'update:visible': [value: boolean];
  'select': [sentence: any];
}>();

// 数据状态
const list = ref([]);
const loading = ref(false);
const searchText = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 计算属性
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const filteredList = computed(() => {
  if (!searchText.value) {
    return list.value;
  }
  return list.value.filter(item => 
    item.content.toLowerCase().includes(searchText.value.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchText.value.toLowerCase()))
  );
});

// 获取句子列表
async function getList() {
  loading.value = true;
  try {
    const res = await Api.getSentenceList({
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    });
    list.value = res.list || [];
    total.value = res.total || 0;
  } catch (error) {
    console.error('获取句子列表失败:', error);
    message.error('获取句子列表失败');
  } finally {
    loading.value = false;
  }
}

// 处理搜索
function handleSearch() {
  // 实时搜索，不需要重新请求API
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

// 选择句子
function selectSentence(sentence: any) {
  emit('select', sentence);
  visible.value = false;
}

// 监听模态框打开
function handleVisibleChange(val: boolean) {
  if (val) {
    getList();
  }
}

onMounted(() => {
  // 监听visible变化
  watch(() => props.visible, handleVisibleChange);
});
</script>

<style scoped lang="less">
.sentence-selector {
  .sentence-item {
    &:hover {
      transform: translateY(-1px);
    }
  }
}
</style> 