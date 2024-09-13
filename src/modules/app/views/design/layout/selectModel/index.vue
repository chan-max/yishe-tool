<template>
  <ion-modal :is-open="showSelectModel">
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button size="small" @click="showSelectModel = false">
            <ion-icon slot="icon-only" :icon="close"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>选取一个模型</ion-title>
        <ion-buttons slot="end">
          <ion-button size="small">
            <ion-icon slot="icon-only" :icon="helpCircleOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-grid>
        <ion-row>
          <template v-for="item in list">
            <ion-col size="12">
              <ion-card>
                <van-image :src="item.thumbnail" />
                <ion-card-header>
                  <ion-card-title>{{ item.name }}</ion-card-title>
                  <ion-card-subtitle>更新于 {{ item.updateTime }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                  {{ item.description || "暂无描述" }}
                </ion-card-content>

                <div style="display: flex; justify-content: space-around">
                  <!-- <div style="flex:1;"></div> -->
                  <ion-button fill="clear" @click="select(item)">
                    <ion-icon slot="end" :icon="checkmarkDoneOutline"></ion-icon>
                    使用该模型
                  </ion-button>
                </div>
              </ion-card>
            </ion-col>
          </template>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { showSelectModel } from "@/modules/app/views/design/store";
import { close, checkmarkDoneOutline ,helpCircleOutline} from "ionicons/icons";
import { getProductModelList } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { currentOperatingBaseModelInfo } from "@/components/design/store";

const { list } = usePaging(
  (params) => {
    return getProductModelList({
      ...params,
      pageSize: 999,
    });
  },
  {
    forEach: (item) => {
      item.thumbnail = 'https://' + item.thumbnail;
      item.url = 'https://' + item.url;
      return;
    },
  }
);

function select(item) {
  currentOperatingBaseModelInfo.value = item;
  showSelectModel.value = false;
}
</script>

<style lang="less" scoped>
.van-image {
  width: 100%;
  min-height: 12em;
}

:deep(ion-card) {
  padding: 0;
  margin: 0;
}
</style>
