import { ref, computed } from 'vue'


export enum StickerType {
    IMAGE = 'image'
}

export const stickerLabelMap = {
    [StickerType.IMAGE] :'图片'
}

export const stickerQueryTags = ref([
    {
        label: "最近更新",
        checked: false,
        key: 'latest'
    },
    {
        label: "热门",
        checked: false,
        key: 'hot'
    },
    {
        label: "文字",
        checked: false,
        key: 'text'
    },
    {
        label: "图片",
        checked: false,
        key: 'image'
    },
    {
        label: "印章",
        checked: false,
    },
    {
        label: "矢量图",
        checked: false,
    },
    {
        label: "组合类",
        checked: false,
    },
    {
        label: "二维码",
        checked: false,
    },
    {
        label: "条形码",
        checked: false,
    },
    {
        label: "我的收藏",
        checked: false,
    },
    {
        label: "我的点赞",
        checked: false,
    },
    {
        label: "我上传的",
        checked: false,
        key: 'mine'
    },
]);

// 参数过滤
export const stickerQueryParams = computed(() => {
    const params: any = {}

    stickerQueryTags.value.forEach((tag) => {
        if (!tag.checked) {
            return
        }
        if (tag.key == 'mine') {
            params.myUploads = true
        }

    })
    return params
})


export function getStickerTypeLabel(type){
    switch (type) {
        case 'composition':
            return '自定义组合'
        case 'image':
            return '图片'
        case 'texture':
            return '材质纹理'
        default: 
            return '未知'
    }
}