<template>
  <div class="search-container">
    <div class="search-input">
      <el-row justify="center" align="center">
        <el-col :xl="14">
          <div style="display:flex;justify-content:center; align-items:center">
            <el-input size="large" :prefix-icon="Search"> </el-input>
            <el-button size="large"   style="margin-left:20px"> 
                <span style="font-weight:bold;">搜索</span>    
             </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="search-result-container">
      <div class="search-result"></div>
    </div>
  </div>
</template>
<script setup>
import { Search } from "@element-plus/icons-vue";
</script>
<style lang="less">

.search-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.search-input {
  background: #fff;
  padding: 30px 15px;
  border-bottom: 1px solid #eee;
}

.search-result-container {
  overflow: auto;
  flex: auto;
}

.search-result {
  height: 30000px;
}


</style>
