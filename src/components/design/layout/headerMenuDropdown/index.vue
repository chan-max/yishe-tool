<template>
  <div class="designiy-header-menu-dropdown">
    <icon-menu style="width:16px;height:16px;" @click.stop="toggle"></icon-menu>
    <div
      v-if="showHeaderMenuDropdown"
      class="designiy-header-menu-dropdown-content"
    >
      <menu-main>
        <menu-item>
          <template #icon>
          </template>
          <template #title> 新建 </template>
          <template #suffix> ctrl q</template>
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
import { zIndex } from "../../store";
import iconLogout from '@/icon/logout.svg?vueComponent';

const showHeaderMenuDropdown = ref(false);

function toggle() {
  showHeaderMenuDropdown.value = !showHeaderMenuDropdown.value
}

onMounted(() => {
  document.body.addEventListener("click", (e) => {
    showHeaderMenuDropdown.value = false
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
  z-index:1;
}
</style>
