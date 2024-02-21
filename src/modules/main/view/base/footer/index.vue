<!--
 * @Author: chan-max 2651308363@qq.com
 * @Date: 2023-12-23 07:31:43
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-20 20:19:20
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
            </div >
            <div class="column">
                <div> 资源 </div>
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

}

.columns {
    display: flex;
    justify-content: space-between;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 20px;
}

.column{
    display: flex;
    flex-direction: column;
    row-gap: 20px;
    color: #ccc;
    font-size: 14px;
}

.gradient-border {
    height: 12px;
    width: 100%;
    background: linear-gradient(90deg,
            #fa6225,
            #fc9632,
            #eacc4b,
            #7bc860,
            #62b394,
            #4793f5,
            #7883f9);
}

hr {
    width: 98%;
    border: 1px solid #111;
}

.copyright {
    flex-shrink: 0;
    font-size: 12px;
    color: #999;
    box-sizing: content-box;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
</style>
