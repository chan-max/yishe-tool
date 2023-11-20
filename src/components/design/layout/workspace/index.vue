<template>
 <div class="designiy-workspace">
   {{currentOperatingModelInfo}}
 </div>
</template>
<script setup> 
   import {currentOperatingModelInfo} from '../../store'
</script>
<style lang="less">


.designiy-workspace{
   width:300px;
   height:100%;
}
</style>