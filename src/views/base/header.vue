<template>
  <el-row justify="center" style="height:100%">
    <el-col  :xl="16"  style="height:100%">
      <div id="header-container">
        <div class="logo">
          <div> <img src="/img/logo.svg" width="30" height="30"> </div>
          <div class="line"></div>
          <div>
            <div style="font-size:20px;color:#666">衣设网</div>
          </div>
        </div>
        <div class="header-container-link">设计室</div>
        <div class="header-container-link">作品展</div>
        <div class="header-container-search">
          <el-input placeholder="寻找独一无二的设计"   :prefix-icon="Search"></el-input>
        </div>
        <div class="siginup">登 录  </div>
        <el-button color="#1db1e2" @click="login"> <span style="font-weight:bold;color:#fff;font-size:14px">注 册</span> </el-button>
        <el-button color="#f35336" @click="$router.push({name:'Design'})"> 
          <span style="margin-right:5px;"><bg-colors-outlined></bg-colors-outlined></span>
          <span style="font-weight:bold;color:#fff;font-size:14px">开始创作</span> 
          </el-button>
      </div> 
    </el-col>
  </el-row>
</template>

<script setup>
import { BgColorsOutlined }from '@ant-design/icons-vue';
import { Search } from '@element-plus/icons-vue'


</script>

<style lang="less">
.logo {
  height: 100%;
  display:flex;
  margin-right: 20px;
  justify-content: space-around;
  align-items: center;
  .line{
    width: 1px;
    height: 50%;
    background: #888;
    margin: 10px;
  }
}

#header-container {
  width: 100%;
  height: 100%;
  padding: 0 15px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-container-link {
  margin: 0 20px;
  color: #555;
  font-weight: bold;
  font-size: 12px;
}

.header-container-search{
  flex:auto;
  padding: 0 20px;
}


.siginup{
  margin:  0 20px;
  font-size: 14px;
  cursor: pointer;
  font-weight: bold;
  color: #777;
  transition: 0.5s all;
  &:hover{
    color: #1db1e2;
  }
}



</style>
