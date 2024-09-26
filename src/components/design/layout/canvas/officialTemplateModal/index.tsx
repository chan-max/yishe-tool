import { Modal } from "ant-design-vue"

import component from './index.vue'
import { ref } from 'vue'

import Api from '@/api'


export const showOfficialTempalteModal = ref(false)

/**
 * @group 官方分类 , 添加分类时以此作为 key 来存储
*/

export const officialStickerTemplateOptions = [
    {
        label: '服装贴花',
        value:'cloth'
    },
    {
        label: '印章',
        value:'stamp'
    },
    {
        label: '徽章',
        value:'badge'
    },
    {
        label: '名片',
        value:'card'
    },
    {
        label: '旗帜',
        value:'flag'
    },    
    {
        label: '玩具贴纸',
        value:'sticker-paper'
    },
    {
        label: '纹身',
        value:'tattoo'
    },
    {
        label: '特殊效果',
        value:'special'
    },
    {
        label: '店铺牌匾',
        value:'special'
    },
]

