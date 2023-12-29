<template>
    <div ref="headerBar" class="header-bar flex justify-center z-10">
        <div class="header-bar-content flex justify-between items-center">
            <div class="header-bar-logo" @click="$router.push({ name: 'Home' })">衣设</div>
            <router-link  v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Market' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    在线商场
                </div>
            </router-link>
            <router-link  v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Ai' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    AI
                </div>
            </router-link>
            
            <router-link  v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Workspace' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    我的工作台
                </div>
            </router-link>

            <div style="flex: 1"></div>

            <user-avatar v-if="loginStatusStore.isLogin" />
            <div v-else>
                <el-button @click="$router.push({ name: 'Signup' })" link round>
                    注 册
                </el-button>
                <el-button type="primary" plain @click="$router.push({ name: 'Login' })" round>
                    登 录
                </el-button>
            </div>
        </div>
    </div>
</template>
  
<script setup>
import { Search } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import iconArrowDown from "@/icon/arrow-down.svg?vueComponent";
import { useLoginStatusStore } from "@/store/stores/login";

const loginStatusStore = useLoginStatusStore();
</script>
  
<style lang="less">
.header-bar {
    width: 100%;
    height: 64px;
    background: #fff;
    border-bottom: 1px solid #eee;

}

.header-bar-content {
    width: 1600px;
    padding: 0 50px;
    column-gap: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 40px;
}


.header-bar-logo {
    font-size: 15px;
    font-weight: bold;
}

.header-bar-menu-item {
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: 5px;
    text-wrap: nowrap;
    cursor: pointer;

    svg {
        width: 10px;
        height: 10px;
    }
}

.fixed {
    position: fixed;
}

.header-bar-menu-item-active {
    border-bottom: 2px solid #6900ff;
}
</style>
  