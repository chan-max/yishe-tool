<template>
  <div class="designiy-header-menu-dropdown">
    <icon-menu style="width: 16px; height: 16px" @click.stop="toggle"></icon-menu>
    <div v-if="showHeaderMenuDropdown" class="designiy-header-menu-dropdown-content">
      <menu-main>
        <menu-item>
          <template #icon>
            <icon-new></icon-new>
          </template>
          <template #title> 新建 </template>
          <template #children>
            <menu-main>
              <menu-item>
                <template #title>111</template>
              </menu-item>
              <menu-item>
                <template #title>2222</template>
                <template #children>
                  <menu-main>
                    <menu-item>
                      <template #title>111</template>
                    </menu-item>
                    <menu-item> <template #title>2222</template></menu-item>
                  </menu-main>
                </template>
              </menu-item>
            </menu-main>
          </template>
        </menu-item>
        <menu-item>
          <template #icon>
            <icon-screenshot></icon-screenshot>
          </template>
          <template #title> 截屏当前画布 </template>
        </menu-item>
        <menu-item>
          <template #icon>
            <icon-upload></icon-upload>
          </template>
          <template #title> 上传 </template>
          <template #children>
            <menu-main>
              <menu-item>
                <template #title> 上传模型 </template>
              </menu-item>
              <menu-item>
                <template #title> 上传图片 </template>
              </menu-item>
              <menu-item>
                <template #title> 上传字体文件 </template>
              </menu-item>
              <menu-item>
                <template #title> 上传文字贴纸 </template>
              </menu-item>
              <menu-item>
                <template #title> 上传自定义模型 </template>
              </menu-item>
            </menu-main>
          </template>
        </menu-item>
        <menu-item>
          <template #icon>
            <icon-view></icon-view>
          </template>
          <template #title> 视图 </template>
          <template #children>
            <menu-main>
              <menu-item>
                <template #title> 选择模型 </template>
                <template #suffix>
                  <el-switch v-model="showBaseModelSelectContainer" size="small" />
                </template> 
              </menu-item>
              <menu-item>
                <template #title> 操作贴纸 </template>
                <template #suffix>
                  <el-switch v-model="showDecalControlContainer" size="small" />
                </template>
              </menu-item>
              <menu-item>
                <template #title> 显示工作台 </template>
                <template #suffix>
                  <el-switch v-model="showWorkspaceContainer" size="small" />
                </template>
              </menu-item>
              <menu-item>
                <template #title> 字体上传 </template>
                <template #suffix>
                  <el-switch v-model="showFontUploadContainer" size="small" />
                </template>
              </menu-item>
            </menu-main>
          </template>
        </menu-item>
        <menu-item>
          <template #icon>
            <icon-logout></icon-logout>
          </template>
          <template #title> 退出 </template>
        </menu-item>
      </menu-main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import iconMenu from "@/icon/menu.svg?vueComponent";
import menuMain from "./menu.vue";
import menuItem from "./menuItem.vue";
import { showWorkspaceContainer, showBaseModelSelectContainer ,showDecalControlContainer,showFontUploadContainer} from "../../store";
import iconLogout from "@/icon/logout.svg?vueComponent";
import iconNew from "@/icon/new.svg?vueComponent";
import iconView from "@/icon/view.svg?vueComponent";
import iconUpload from "@/icon/upload-normal.svg?vueComponent";
import iconScreenshot from "@/icon/screenshot.svg?vueComponent";

const showHeaderMenuDropdown = ref(false);

function toggle() {
  showHeaderMenuDropdown.value = !showHeaderMenuDropdown.value;
}

onMounted(() => {
  document.body.addEventListener("click", (e) => {
    showHeaderMenuDropdown.value = false;
  });
});
</script>

<style lang="less">
.designiy-header-menu-dropdown {
  width: 30px;
  height: 30px;
  background: #f1f1f1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  border-radius: 5px;
  font-size: 16px;
  position: relative;
}

.designiy-header-menu-dropdown-content {
  position: absolute;
  top: 42px;
  left: 0;
  z-index: 1;
}
</style>
