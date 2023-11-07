<template>
  <div class="user-update">
    <div class="user-update-header">
      <div style="font-size: 14px; font-weight: bold; color: #444">更新个人信息</div>
    </div>

    <div class="user-update-content">
      <div class="user-update-content-left">
        <div style="font-weight: bold; font-size: 16px; padding: 10px; width: 200px">
          修改头像
        </div>
        <avatar-upload />
      </div>
      <div class="user-update-content-right">
        <el-form size="large" label-position="top">
          <div class="user-update-content-right-title">基本信息</div>
          <el-form-item label="名字">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="Activity zone">
            <el-input v-model="form.phonenumber" />
          </el-form-item>
          <el-form-item label="Activity form">
            <el-input v-model="form.address" />
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatarUpload from "./avatarUpload.vue";
import { reactive } from "vue";

const form = reactive({});
</script>

<style lang="less">
.user-update {
  .el-form-item__label {
    position: relative;
    z-index: 1;
    font-size: 12px;
    font-weight: bold;
    background-color: #fff;
    display: inline-block !important;
    top: 10px;
    left: 10px;
    padding: 0px 10px;
    margin-bottom: 0px !important;
  }
  .el-input__inner {
    height: 45px;
  }
  .el-input__wrapper {
  }
}
.user-update-header {
  width: 100%;
  height: 60px;
  background-color: fade(#6900ff, 6%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 calc(50% - 600px);
}

.user-update-content {
  width: 100%;
  margin-top: 80px;
  height: auto;
  display: flex;
  justify-content: center;
}

.user-update-content-left {
  height: 1000px;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-update-content-right {
  width: 900px;
  height: 1000px;
}

.user-update-content-right-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
</style>
