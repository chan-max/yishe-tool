<template>
  <div class="user-update">
    <div class="user-update-header">
      <div style="font-size: 14px; font-weight: bold; color: #444">更新个人信息</div>
    </div>

    <div class="user-update-content">
      <div class="user-update-content-left">
        <avatar-upload @select="selectAvatar" />
      </div>
      <div class="user-update-content-right">
        <el-form size="large" label-position="top">
          <div class="user-update-content-right-subtitle">基本信息</div>
          <el-form-item label="名字">
            <el-input />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input  />
          </el-form-item>
          <el-form-item label="收货地址">
            <el-input />
          </el-form-item>

          <div class="user-update-content-right-subtitle">性别</div>
          <el-form-item>
            <el-radio-group size="large">
              <el-radio label="男" />
              <el-radio label="女" />
              <el-radio label="保密" />
            </el-radio-group>
          </el-form-item>
          <el-button @click="submit" type="primary"> 确认修改 </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import avatarUpload from "./avatarUpload.vue";
import { reactive } from "vue";
import { updateUserInfo } from "@/api/index";
import { useLoginStatusStore } from "@/store/stores/user";

const form = reactive({
  avatar: "",
});

function selectAvatar(file) {
  form.avatar = file;
}

async function submit() {
  const userStore = useLoginStatusStore();
  await updateUserInfo({
    ...userStore.userInfo,
    ...form,
  });
}
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

  .el-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

.user-update-content-right-subtitle {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.user-update-content-right-desc {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}
</style>
