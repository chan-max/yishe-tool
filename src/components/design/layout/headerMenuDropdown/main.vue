<template>
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
            <icon-view></icon-view>
          </template>
          <template #title> 视图 </template>
          <template #children>
            <menu-main>
              <menu-item>
                <template #title> 基础页面布局 </template>
                <template #children>
                  <menu-main>
                    <menu-item>
                      <template #title> 顶部主导航栏 </template>
                      <template #suffix>
                        <el-switch v-model="showHeader" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 顶部副导航栏 </template>
                      <template #suffix>
                        <el-switch v-model="showSubHeader" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 左侧菜单 </template>
                      <template #suffix>
                        <el-switch v-model="showLeftMenu" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 底部操作栏 </template>
                      <template #suffix>
                        <el-switch v-model="showBottomMenu" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 选择模型 </template>
                      <template #suffix>
                        <el-switch v-model="showBaseModelSelect" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 操作贴纸 </template>
                      <template #suffix>
                        <el-switch v-model="showDecalControl" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 显示工作台 </template>
                      <template #suffix>
                        <el-switch v-model="showWorkspace" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 字体上传 </template>
                      <template #suffix>
                        <el-switch v-model="showFontUpload" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 字体列表 </template>
                      <template #suffix>
                        <el-switch v-model="showFontList" size="small" />
                      </template>
                    </menu-item>
                  </menu-main>
                </template>
              </menu-item>
              <menu-item>
                <template #title> 功能布局 </template>
                <template #children>
                  <menu-main>
                    <menu-item>
                      <template #title> 工作台 </template>
                      <template #suffix>
                        <el-switch v-model="showWorkspace" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 当前操作的模型信息 </template>
                      <template #suffix>
                        <el-switch v-model="showModelInfo" size="small" />
                      </template>
                    </menu-item>
                    <menu-item>
                      <template #title> 已使用的贴纸 </template>
                      <template #suffix>
                        <el-switch v-model="showDecalList" size="small" />
                      </template>
                    </menu-item>
                  </menu-main>
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
</template>
    
<script setup>
import menuMain from "./menu.vue";
import menuItem from "./menuItem.vue";
import {
  showWorkspace,
  showBaseModelSelect,
  showDecalControl,
  showFontUpload,
  showFontList,
  showHeader,
  showSubHeader,
  showLeftMenu,
  showBottomMenu,
  showDecalList,
showModelInfo
} from "../../store";
import iconLogout from "@/icon/logout.svg?vueComponent";
import iconNew from "@/icon/new.svg?vueComponent";
import iconView from "@/icon/view.svg?vueComponent";
import iconUpload from "@/icon/upload-normal.svg?vueComponent";
import iconScreenshot from "@/icon/screenshot.svg?vueComponent";
</script>
    
<style>
</style>