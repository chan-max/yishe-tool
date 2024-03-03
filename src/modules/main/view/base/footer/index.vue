<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-23 07:31:43
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-21 17:50:54
 * @FilePath: /yishe/src/modules/main/view/base/footer/index.vue
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
-->
<template>
    <div class="footer">
        <div class="gradient-border"></div>
        <div class="columns">
            <div class="column">
                <div> 资源 </div>
            </div>
            <div class="column">
                <div> 资源 </div>
            </div>
            <div class="column">
                <div> 资源 </div>
            </div>
            <div class="column">
                <div> 其它相关 </div>
            </div>
            <div class="column">
                <div> 其它相关 </div>
            </div>
            <div class="column">
                <div> 其它相关 </div>
            </div>
        </div>
        <hr>
        <div class="copyright"> copyright 1s.design </div>
    </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.footer {
    overflow: auto;
    width: 100%;
    background-color: #1e1e1e;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    padding: 50px;
    position: relative;
}

.columns {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.column {
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    color: #ddd;
    font-size: 12px;
}

.gradient-border {
    height: 4px;
    width: 100%;
    position: absolute;
    top: 0;
    /* background: linear-gradient(90deg,
            #fa6225,
            #fc9632,
            #eacc4b,
            #7bc860,
            #62b394,
            #4793f5,
            #7883f9); */
    background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 1) 100%);
}

hr {
    width: 100%;
    border: 1px solid #111;
    margin: 30px 0;
    box-sizing: border-box;
}

.copyright {
    flex-shrink: 0;
    font-size: 12px;
    color: #999;
    box-sizing: content-box;
    width: 100%;
    box-sizing: border-box;
}
</style>
