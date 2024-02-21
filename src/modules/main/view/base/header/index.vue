<!--
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-31 21:19:02
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 18:34:27
 * @FilePath: /yishe/src/modules/main/view/base/header/index.vue
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
-->
<template>
    <div ref="headerBar" class="header-bar flex justify-center z-10">
        <div class="header-bar-content flex justify-between items-center">
            <div class="header-bar-logo" @click="$router.push({ name: 'Home' })">1s衣设</div>
            <!-- <div style="flex: 1"></div> -->
            <router-link v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Market' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    在线商场
                </div>
            </router-link>
            <router-link v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Ai' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    AI
                </div>
            </router-link>
            <router-link v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Workspace' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    我的工作台
                </div>
            </router-link>
            <router-link v-slot="{ navigate, isActive, isExactActive }" :to="{ name: 'Seller' }" custom>
                <div class="header-bar-menu-item" :class="{ 'header-bar-menu-item-active': isActive }" @click="navigate">
                    我是商家
                </div>
            </router-link>
            <div style="flex: 1"></div>

            <template v-if="loginStatusStore.isLogin">
                <div class="tools">
                    <!-- <div  title="快速上传">
                        <icon-homepageupload></icon-homepageupload>
                    </div>
                    <div  title="我的商品">
                        <icon-homepageshop></icon-homepageshop>
                    </div> -->
                    <!-- <div  title="搜索全站">
                        <icon-homepagesearch></icon-homepagesearch>
                    </div>
                    <div title="我的消息">
                        <icon-homepagebell></icon-homepagebell>
                    </div>
                    <div  title="联系我们">
                        <icon-homepagecontact></icon-homepagecontact>
                    </div> -->
                </div>
                <user-avatar />
            </template>
            <template v-else>
                <div>
                    <el-button @click="$router.push({ name: 'Signup' })" link round>
                        注 册
                    </el-button>
                    <el-button type="primary" plain @click="$router.push({ name: 'Login' })" round>
                        登 录
                    </el-button>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import userAvatar from "@/components/user/userAvatar.vue";
import { ref, onMounted, onUnmounted } from "vue";
import iconArrowDown from "@/icon/arrow-down.svg?component";
import { useLoginStatusStore } from "@/store/stores/login";
import iconHomepagebell from '@/icon/web/homepagebell.svg?component';
import iconHomepageupload from '@/icon/web/homepageupload.svg?component';
import iconHomepageshop from '@/icon/web/homepageshop.svg?component';
import iconHomepagecontact from '@/icon/web/homepagecontact.svg?component';
import iconHomepagesearch from '@/icon/web/homepagesearch.svg?component';


const loginStatusStore = useLoginStatusStore();
</script>
  
<style lang="less" scoped>
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
    *{
        flex-shrink: 0;
    }
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
    height: 30px;
    font-weight: 500;
    color: #000;
    opacity: .7;
    border-bottom: 2px solid transparent;

    svg {
        width: 10px;
        height: 10px;
    }
}

.fixed {
    position: fixed;
}

.header-bar-menu-item-active {
    opacity: 1;
    border-bottom: 2px solid #6900ff;
}

.tools {
    display: flex;
    align-items: center;
    column-gap: 12px;

    div{
        width: 16px;
        height: 16px;
    }
    svg {
        width: 16px;
        height: 16px;
        color: #ccc;

        &:hover {
            transform: scale(1.1);
            color: #aaa;
            cursor: pointer;
        }
    }
}
</style>
  