<template>
  <div class="banner"></div>
  <div style="text-align:center;margin-top:100px;font-weight:bold;font-size:24px;color:#595959;"> 每个人都是设计师 </div>
  <div style="text-align:center;margin-top:20px;font-weight:bold;font-size:40px;color:#444;"> 开放式服装设计 & 交易平台 </div>
</template>

<script setup>


</script>

<style>

.banner {
    width: 100%;
    height: 70%;
    background: linear-gradient(-45deg, #1db1e2, #00c1de);
    background-size: 600% 600%;
    animation: gradientBG 5s ease infinite;
    box-shadow: inset 0px 0px 300px 50px rgba(0,0,0,0.60);
  }

  @keyframes gradientBG {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
  }

</style>