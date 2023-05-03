<template>
  <div id="header-container">
    <div class="header-container-left">
        <div class="header-container-left-link">设计室</div>
        <div class="header-container-left-link">作品展</div>
    </div>
    <div class="header-container-right"></div>
  </div>
</template>

<script setup>

</script>

<style lang="less">
#header-container{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.header-container-left{
    display: flex;

}

.header-container-left-link{
    height: 100%;
    line-height: 60px;
    margin: 0 20px;
    color: #333;
    font-weight: bold;
    font-size: 12px;
}
</style>