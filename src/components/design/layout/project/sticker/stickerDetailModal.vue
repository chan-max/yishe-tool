<template>
    <a-modal v-model:open="show" :footer="null" :centered="true" :destroyOnClose="true"
        @close="close"
        width="980px">
        <div class="flex">
            <s1-img :src="detailInfo.thumbnail" style="width:480px;height:480px;flex-shrink:0;" @load="imgLoad">
            </s1-img>
            <div style="padding:24px;row-gap:12px;" class="flex flex-col">
                <h1> {{ detailInfo.name }} </h1>
                <h6> {{ detailInfo.description }} </h6>
                <h6> {{ detailInfo.keywords }} </h6>
                <h6> {{ detailInfo.updateTime }} </h6>
                <div class="color-palette flex " style="column-gap: 12px;">
                <div style="width:24px;height:24px;border-radius: 12px;" v-for="color in colors"
                    :style="{ background: color }"></div>
            </div>
            </div>
        </div>
    </a-modal>
</template>
<script setup lang='ts'>
import { useStickerDetailModal } from './stickerModal.ts'
import { ref } from 'vue'
import Utils from '@/common/utils'

const { show, detailInfo } = useStickerDetailModal()

const palette = ref()

const colors = ref([])


function close(){
    colors.value = []
}

// 图片加载完成
async function imgLoad(img) {
    img.crossOrigin = 'Anonymous';
    let _palette = await Utils.color.getPalette(img) as Array<[number, number, number]>

    colors.value = _palette.map((rgb) => {
        return `rgba(${rgb.join(',')})`
    })

    palette.value = _palette
}

</script>

<style lang="less" scoped></style>