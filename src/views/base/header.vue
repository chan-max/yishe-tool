<template>
  <el-row justify="center" style="height:100%">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="16"  style="height:100%">
      <div id="header-container">
        <div class="logo">
          <div> <img src="img/logo.svg" width="30" height="30"> </div>
          <div class="line"></div>
          <div>
            <div style="font-size:20px;color:#666">衣设网</div>
          </div>
        </div>
        <div class="header-container-left-link">设计室</div>
        <div class="header-container-left-link">作品展</div>
        <div style="flex:auto"></div>
        <div class="siginup">登 录  </div>
        <el-button color="#1db1e2" @click="login"> <span style="font-weight:bold;color:#fff;font-size:14px">注 册</span> </el-button>
      </div>  
    </el-col>
  </el-row>
</template>

<script setup></script>

<style lang="less">
.logo {
  height: 100%;
  display:flex;
  margin-right: 40px;
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
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-container-left-link {
  margin: 0 20px;
  color: #555;
  font-weight: bold;
  font-size: 12px;
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
