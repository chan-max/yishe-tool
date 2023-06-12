<template>
  <el-row justify="center" style="height: 100%">
    <el-col :xl="14" style="height: 100%">
      <div id="header-container">
        <div class="logo">
          衣设网 1s.design
        </div>
        <div class="header-container-link">作品展</div>
        <div class="header-container-link">设计室</div>
        <div class="header-container-link">工作台</div>
        <div class="header-container-link">商场</div>
        <div style="flex: auto"></div>
        <div class="header-container-search">
          <el-button
            @click="$router.push({ name: 'Search' })"
            :icon="Search"
            size="default"
            circle
          />
        </div>
        <div class="header-container-language">
          <el-button link @click="toggleLanguage"> {{ $t("language") }} </el-button>
        </div>
        <el-button color="#1db1e2" @click="login">
          <span style="font-weight: bold; color: #fff; font-size: 14px"
            >注 册</span
          >
        </el-button>
        <el-button color="#f35336" @click="$router.push({ name: 'Design' })">
          <span style="margin-right: 5px"><bg-colors-outlined></bg-colors-outlined></span>
          <span style="font-weight: bold; color: #fff; font-size: 14px" >开始创作</span>
        </el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { BgColorsOutlined } from "@ant-design/icons-vue";
import { Search } from "@element-plus/icons-vue";

import { useI18n } from "vue-i18n";

const {t,locale,global} = useI18n()

function toggleLanguage(){
  if(locale.value == 'en'){
    locale.value = 'cn'
  }else{
    locale.value = 'en'
  }
}

</script>

<style lang="less">
.logo {
    font-size: 17px;
    display: flex;
    margin-right: 20px;
    justify-content: space-around;
    align-items: center;
    font-weight: bold;
  .line {
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

.header-container-language {
  margin: 0 20px;
}
</style>
