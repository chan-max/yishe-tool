<template>
  <div class="mobile-market-dropdown">
    <van-dropdown-menu ref="menuRef">
      <!-- <van-dropdown-item>
        <template #title>
          <div>综合排序 <van-icon name="arrow-down" size="10" /></div
        ></template>
      </van-dropdown-item> -->

      <van-dropdown-item
        :options="createTimeDropdownMenuOptions"
        v-model="queryParams.createTimeOrderBy"
        :title-class="queryParams.createTimeOrderBy ? 'active-dropdown' : ''"
      >
        <template #title>
          {{
            getOptionsValue(createTimeDropdownMenuOptions, queryParams.createTimeOrderBy)
          }}
          <van-icon name="underway-o" size="10"
        /></template>
      </van-dropdown-item>

      <van-dropdown-item
        :options="priceDropdownMenuOptions"
        v-model="queryParams.priceOrderBy"
        :title-class="queryParams.priceOrderBy ? 'active-dropdown' : ''"
      >
        <template #title="slot">
          {{ getOptionsValue(priceDropdownMenuOptions, queryParams.priceOrderBy) }}
          <van-icon name="after-sale" size="10"
        /></template>
      </van-dropdown-item>

      <van-dropdown-item
        v-model="queryParams.baseModelId"
        :title-class="queryParams.baseModelId ? 'active-dropdown' : ''"
      >
        <template #title>
          {{
            queryParams.baseModelId
              ? getOptionsValue(baseModelList, queryParams.baseModelId, {
                  outputKey: "name",
                  inputKey: "id",
                })
              : "款式"
          }}
          <van-icon name="contact-o" size="10"
        /></template>
        <template #default>
          <div style="padding: 12px" class="flex flex-wrap justify-center">
            <div :span="6" v-for="item in baseModelList">
              <div
                class="flex flex-col justify-center p-2"
                @click="baseModelDropMenuSelect(item)"
              >
                <s1-img
                  :src="item.thumbnail.url"
                  style="width: 84px; height: 84px"
                  :style="{
                    background: item.id == queryParams.baseModelId ? '#eee' : '#f9f9f9',
                  }"
                ></s1-img>
                <div
                  style="padding: 4px; text-align: center; color: #aaa"
                  class="font-bold"
                >
                  {{ item.name }}
                </div>
              </div>
            </div>
          </div>

          <div style="padding: 12px 24px">
            <van-button type="primary" block round @click="baseModelDropMenuReset">
              看所有款式
            </van-button>
          </div>
        </template>
      </van-dropdown-item>

      <van-dropdown-item
        v-model="queryParams.color"
        :title-class="queryParams.color ? 'active-dropdown' : ''"
      >
        <template #title>
          <div class="flex items-center">
            <span
              v-if="queryParams.color"
              style="
                width: 12px;
                height: 12px;
                display: inline-block;
                border-radius: 6px;
                margin-right: 4px;
              "
              :style="{
                background: getOptionsValue(colorDropMenuOptions, queryParams.color, {
                  outputKey: 'value',
                  inputKey: 'text',
                }),
              }"
            ></span>
            {{ queryParams.color ? queryParams.color : "颜色" }}

            <van-icon name="arrow-down" size="10" />
          </div>
        </template>
        <template #default>
          <div style="padding: 12px; gap: 12px" class="flex flex-wrap justify-center">
            <div v-for="item in colorDropMenuOptions">
              <a-tag
                @click="colorDropMenuSelect(item)"
                :bordered="false"
                :color="item.value"
                style="box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px"
                >{{ item.text }}</a-tag
              >
            </div>
          </div>

          <div style="padding: 12px 24px">
            <van-button type="primary" block round @click="colorDropMenuReset">
              看所有颜色
            </van-button>
          </div>
        </template>
      </van-dropdown-item>

      <van-dropdown-item
        :options="customizableDropdownMenuOptions"
        v-model="queryParams.customizable"
        :title-class="queryParams.customizable ? 'active-dropdown' : ''"
      >
        <template #title="slot">
          {{ getOptionsValue(customizableDropdownMenuOptions, queryParams.customizable) }}
          <van-icon name="arrow-down" size="10"
        /></template>
      </van-dropdown-item>

      <van-dropdown-item
        v-model="queryParams.style"
        :title-class="queryParams.style ? 'active-dropdown' : ''"
      >
        <template #title>
          <div class="flex items-center">
            {{ queryParams.style ? queryParams.style : "服装风格" }}
            <van-icon name="arrow-down" size="10" />
          </div>
        </template>
        <template #default>
          <div style="padding: 12px; gap: 12px" class="flex flex-wrap justify-center">
            <div v-for="item in clothingStyleDropdownMenuOptions">
              <a-tag
                @click="clothingStyleDropdownMenuSelect(item)"
                :bordered="false"
                :color="item.color"
                >{{ item.text }}</a-tag
              >
            </div>
          </div>

          <div style="padding: 12px 24px">
            <van-button type="primary" block round @click="styleDropMenuReset">
              看所有风格
            </van-button>
          </div>
        </template>
      </van-dropdown-item>

      <van-dropdown-item
        v-model="queryParams.content"
        :title-class="queryParams.content ? 'active-dropdown' : ''"
      >
        <template #title>
          <div class="flex items-center">
            {{ queryParams.content ? `内容:${queryParams.content}` : "服装内容" }}
            <van-icon name="arrow-down" size="10" />
          </div>
        </template>
        <template #default>
          <div style="padding: 12px; gap: 12px" class="flex flex-wrap justify-center">
            <div v-for="item in clothingContentsDropdownMenuOptions">
              <a-tag @click="clothingContentDropdownMenuSelect(item)" :bordered="false">{{
                item.text
              }}</a-tag>
            </div>
          </div>

          <div style="padding: 12px 24px">
            <van-button type="primary" block round @click="contentDropMenuReset">
              看所有内容
            </van-button>
          </div>
        </template>
      </van-dropdown-item>
    </van-dropdown-menu>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  getOptionsValue,
  createTimeDropdownMenuOptions,
  priceDropdownMenuOptions,
  queryParams,
  useDropdownMenuMixin,
  colorDropMenuOptions,
  menuRef,
  customizableDropdownMenuOptions,
  clothingStyleDropdownMenuOptions,
  clothingContentsDropdownMenuOptions,
} from "./index.tsx";

let { baseModelList } = useDropdownMenuMixin();

function baseModelDropMenuSelect(item) {
  queryParams.value.baseModelId = item.id;
  menuRef.value.close();
}

function baseModelDropMenuReset() {
  queryParams.value.baseModelId = null;
  menuRef.value.close();
}

function colorDropMenuSelect(item) {
  queryParams.value.color = item.text;
  menuRef.value.close();
}

function colorDropMenuReset() {
  queryParams.value.color = null;
  menuRef.value.close();
}

function clothingStyleDropdownMenuSelect(item) {
  queryParams.value.style = item.text;
  menuRef.value.close();
}

function styleDropMenuReset() {
  queryParams.value.style = null;
  menuRef.value.close();
}

function clothingContentDropdownMenuSelect(item) {
  queryParams.value.content = item.text;
  menuRef.value.close();
}

function contentDropMenuReset() {
  queryParams.value.content = null;
  menuRef.value.close();
}
</script>

<style lang="less">
.mobile-market-dropdown {
  flex-shrink: 0;
  --van-dropdown-menu-height: 48px;

  .van-dropdown-menu__item {
    flex: auto;
  }

  .van-dropdown-menu__bar {
    box-shadow: none;
    column-gap: 12px;
  }

  .van-dropdown-menu__title {
    background: #f3f3f6;
    color: rgba(0, 0, 0, 0.7);
    font-weight: bold;
    font-size: 11px;
    line-height: 11px;
    border-radius: 999px;
    padding: 6px 8px;
  }

  .van-dropdown-menu__title:after {
    display: none;
  }

  .active-dropdown {
    box-shadow: #ff4e93 0px 0px 0px 1px;
  }
}
</style>
