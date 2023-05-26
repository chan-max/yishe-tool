<template>
  <div class="designiy-header">
    <div class="designiy-header-select-model">
      <el-dropdown @command="modelChange" size="small" split-button>
        <div class="designiy-header-select-model-btn">{{ currentModel.name }}</div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item  v-for="model,index in modelList" :key="index" :command="model">{{ model.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="designiy-header-item">场景颜色 <bg-colors-outlined /></div>
    <div class="designiy-header-item">环境贴图</div>
    <div class="designiy-header-item">天空盒</div>
  </div>
</template>

<script setup>
import { getBaseModelList } from "@/api/index.ts";
import { BgColorsOutlined,MenuOutlined } from "@ant-design/icons-vue";
import { ref ,defineEmits} from "vue";


const emits = defineEmits([
  'selectModel'
])



const modelList = ref();

const currentModel = ref({
  name:'选择模型'
})  


function modelChange(model){
    currentModel.value = model
    emits('selectModel',currentModel.value)
}

getBaseModelList().then((result) => modelList.value = result.data);


</script>

<style lang="less">
.designiy-header {
  width: 100%;
  height: 40px;
  background-color: #fcfcfc;
  border-bottom: 1px solid #efefef;
  display: flex;
  justify-content: start;
  align-items: center;
  position: absolute;
  top: 0;
}


.designiy-header-item {
  color: #555;
  font-size: 12px;
  margin: 0 10px;
  cursor: pointer;
  &:hover{
    color: black;
  }
}

.designiy-header-select-model {
  margin: 0 20px;
}

.designiy-header-select-model-btn{
  min-width: 60px;
}

</style>
