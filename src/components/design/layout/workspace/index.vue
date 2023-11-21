<template>
 <div class="designiy-workspace">
   <workspace-content v-if="currentOperatingModelInfo"></workspace-content>
   <workspace-empty v-else></workspace-empty>

 </div>
</template>
<script setup> 
   import {currentOperatingModelInfo} from '../../store'
   import workspaceEmpty from './empty.vue'
   import workspaceContent from './content.vue'
</script>
<style lang="less">


.designiy-workspace{
   width:320px;
   height:100%;
}
</style>