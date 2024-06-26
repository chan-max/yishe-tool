<template>
    <div class="tags">
        <template v-for="item in stickerQueryTags">
            <el-check-tag class="tag" :checked="item.checked" type="primary" @change="tagChange($event, item)">
                {{ item.label }}
            </el-check-tag>
        </template>
        <div style="flex:1;"></div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {stickerQueryTags,stickerQueryParams} from './index.ts'
const emits = defineEmits(['change'])

function tagChange(value, item) {
    item.checked = value
    emits('change', stickerQueryTags.value)
}

</script>

<style scoped lang="less">
.tags {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: .8em .4em;
}

.tag {
    padding: 6px 10px;
    border-radius: 12px;
    font-weight: 700;
    font-size: .8rem;
}
</style>
