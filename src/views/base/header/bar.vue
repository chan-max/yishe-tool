<template>
    <div ref="headerBar" class="header-bar flex justify-center z-10">
        <div class="header-bar-content flex justify-between items-center">
            <div class="header-bar-content-menu">
                <font-awesome-icon :icon="['fas', 'bars']" />
                导航
            </div>
            <div style="flex:1"></div>
            <div class="header-bar-content-search">
                <el-input class="" v-model="search" placeholder="搜索服装" size="normal">
                    <template #suffix>
                        <div style="cursor:pointer"> <font-awesome-icon :icon="['fas', 'magnifying-glass']" /></div>
                    </template>
                </el-input>
            </div>
            <user></user>
        </div>
    </div>
</template>
    
<script setup lang='ts'>
import { Search } from '@element-plus/icons-vue';
import user from './user.vue'
import { ref, onMounted, onUnmounted } from 'vue';

const search = ref('')
const headerBar = ref()

onMounted(() => {
    // 获取导航栏
    var navbar = headerBar.value;
    // 获取导航栏距离页面顶部的偏移量
    var sticky = navbar.offsetTop;
    // 当用户滚动页面时执行的函数
    window.onscroll = function () {
        // 如果滚动的距离大于或等于导航栏的偏移量，添加 "sticky" 类
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("fixed")
        } else {
            // 否则，移除 "sticky" 类
            navbar.classList.remove("fixed");
        }
    };
})

</script>
    
<style>
.header-bar {
    width: 100%;
    height: 50px;
    background: var(--1s-main);
}

.header-bar-content {
    width: 1200px;
    padding: 0 30px;
}

.header-bar-content-menu {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    padding: 5px;
    font-family: 微软雅黑;
    cursor: pointer;
}

.header-bar-content-menu:hover {
    opacity: .9;
}

.header-bar-content-search {
    padding: 0 20px;

    .el-input {
        width: 300px;
        outline: none;
    }
}

.fixed {
    position: fixed;
}
</style>