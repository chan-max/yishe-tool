<template lang="">
    <div class="header-menu flex justify-center">
        <div class="header-menu-content flex justify-between items-center">
            <div class="header-menu-content-logo font-bold text-2xl">
                衣设
            </div>
            <div class="header-menu-content-menu flex">
                <router-link :to="{name:'Home'}" class="header-menu-content-menu-item" active-class="header-menu-content-menu-item_focus"> 
                首页 
                </router-link>
                <router-link :to="{name:'Market'}" class="header-menu-content-menu-item" active-class="header-menu-content-menu-item_focus"> 在线商城 </router-link>
                <router-link :to="{name:'Workspace'}" class="header-menu-content-menu-item" active-class="header-menu-content-menu-item_focus"> 工作台 </router-link>
                <router-link :to="{name:'Design'}" class="header-menu-content-menu-item" active-class="header-menu-content-menu-item_focus"> 设计室 </router-link>
            </div>
            <div class="header-menu-content-tools">tools</div>
        </div>
    </div>
</template>
<script setup>

</script>
<style lang="less">
.header-menu {
    height: 60px;
    width: 100%;
    background-color: #fff;
}

.header-menu-content {
    width: 1200px;
    padding: 0 30px;
}

.header-menu-content-menu-item {
    padding: 0 30px;
    font-weight: bold;
    font-size: 14px;
    color: #555;
    cursor: pointer;
}


.header-menu-content-menu-item_focus,
.header-menu-content-menu-item:hover {
    color: var(--1s-main);
}

.header-menu-content-logo{
    width:200px;
}

.header-menu-content-tools{
    width: 200px;
}
</style>