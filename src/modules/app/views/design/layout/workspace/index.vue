<template>
    <ion-modal :is-open="showWorkspace" :initial-breakpoint=".5" :breakpoints="[0, 0.5]" @didDismiss="didDismiss"
        :keepContentsMounted="true">
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button size="small" @click="showWorkspace = false">
                        <ion-icon slot="icon-only" :icon="close"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title></ion-title>
                <ion-buttons slot="end">
                    <ion-button size="small">
                        <ion-icon slot="icon-only" :icon="helpCircleOutline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="content">
            <ion-list>
                <template v-for="item in currentModelController?.decalControllers">
                    <ion-item>
                        <ion-thumbnail slot="start">
                            <van-image :src="item.info.thumbnail" />
                        </ion-thumbnail>
                        <ion-label>Item</ion-label>
                    </ion-item>
                </template>
            </ion-list>
        </ion-content>
    </ion-modal>
</template>

<script setup lang="ts">
import { showWorkspace } from "@/modules/app/views/design/store";
import { close, checkmarkDoneOutline, helpCircleOutline } from "ionicons/icons";
import { getProductModelListApi } from "@/api";
import { onBeforeMount } from "vue";
import { usePaging } from "@/hooks/data/paging.ts";
import { getStickerListApi } from "@/api";
import { useDesignStore, currentOperatingBaseModelInfo, currentModelController } from "@/components/design/store";



function didDismiss() {
    showWorkspace.value = false;
}
</script>

<style lang="less" scoped>
:deep(ion-grid) {
    --ion-grid-column-padding: 2px;
}


.content{
    :deep(.van-image){
        width: 100px;
        height: 100px;
    }
}
</style>
