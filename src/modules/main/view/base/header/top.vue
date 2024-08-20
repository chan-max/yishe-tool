<template>
  <div class="header-top flex justify-center items-center">
    <div class="header-top-content h-full flex items-center justify-between">
      <div></div>
      <div>
        <div class="tools">
          <!-- <div title="快速上传" @click="openUpload">
            <icon-homepageupload></icon-homepageupload>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Upload } from "@element-plus/icons-vue";
import { useI18n } from "vue-i18n";
import iconArrowDown from "@/icon/arrow-down.svg?component";
import iconHomepagebell from "@/icon/web/homepagebell.svg?component";
import iconHomepageupload from "@/icon/web/homepageupload.svg?component";
import iconHomepageshop from "@/icon/web/homepageshop.svg?component";
import iconHomepagecontact from "@/icon/web/homepagecontact.svg?component";
import iconHomepagesearch from "@/icon/web/homepagesearch.svg?component";


function openUpload(){
  
}

</script>
<style lang="less">
.header-top {
  width: 100%;
  height: 32px;
  background-color: #fff;
  border-bottom: 1px solid #eee;
}

.header-top-content {
  width: 100%;
  padding: 0 60px;
}

.tools {
  display: flex;
  align-items: center;
  column-gap: 12px;

  div {
    width: 16px;
    height: 16px;
  }
  svg {
    width: 16px;
    height: 16px;
    color: #888;

    &:hover {
      transform: scale(1.1);
      color: #222;
      cursor: pointer;
    }
  }
}
</style>
