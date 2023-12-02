<template>
  <div class="login">
    <div class="login-banner">
    </div>
    <div class="login-form">
      <div class="login-form-title">
        <el-form label-position="top" :model="form"  :rules="rules" hide-required-asterisk>
          <el-form-item> 
            <div style="font-size:24px;"> 登录衣设网 </div>
          </el-form-item>
          <el-form-item prop="account">
            <el-input v-model="form.account" placeholder="账号或者邮箱">
            <template #prefix>
                <el-icon><User/></el-icon>
            </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input :type="showPassword ? 'text':'password'" v-model="form.password" placeholder="密码" >
                <template #prefix>
                <el-icon><Lock/></el-icon>
            </template>
                <template #suffix>
                <span  @click="showPassword = !showPassword">
              <el-icon v-if="showPassword"><View /></el-icon>
              <el-icon v-else><Hide /></el-icon>
            </span>
          </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div style="display:flex;width:100%;justify-content:space-between;padding:0 4px;">
                <el-link> 忘记密码? </el-link>
                <el-link> 注册账号 </el-link>
            </div>
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button @click="submit" style="width: 100%" type="primary"> 登 录 </el-button>
          </el-form-item>

          <el-form-item>
            <div style="display:flex;justify-content:end;width:100%">
                <el-checkbox>
                    记住我
                </el-checkbox>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive,ref } from "vue";
import {User,Lock,View,Hide} from '@element-plus/icons-vue'
import {login} from '@/api'

const rules = reactive({
    account:[
    { required: true, message: '请输入账号', trigger: 'blur' },
  ],
  password:[
    { required: true, message: '请输入密码', trigger: 'blur' },
  ]
})

const showPassword = ref(false)

const loading = ref(true)

var form = reactive({
    account:'',
    password:''
});

function submit() {
    
}

</script>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
//   justify-content: center;
}

.login-banner{
    height:280px;
}

.login-form {
    width:auto;
    margin: 30px;

  .el-input,
  .el-button {
    height: 48px;
  }
  
  .el-button,.el-input__wrapper{
    border-radius:8px;
  }
}
</style>
