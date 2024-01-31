import { computed, ref } from "vue"
import availableModel from './contents/availableModel.vue'
import model from './contents/model.vue'

// 工作台所有tab栏
export const WorkspaceTabOptions  =  [{
    label:'已发布的模型',
    component:availableModel,
    key:'availableModel',
},{
    label:'创作的模型',
    component:model,
    key:'model'
},{
    label:'图片',
    component:availableModel,
    key:'image'
},{
    label:'图集',
    component:availableModel,
    key:'imageGroup'
},{
    label:'文字贴纸',
    component:availableModel,
    key:'text'
},{
    label:'字体',
    component:availableModel,
    key:'font'
}]

export const activeWorkspaceTab= ref('availableModel')

export const  activeComponent = computed(() => {
    return WorkspaceTabOptions.find((item) => item.key == activeWorkspaceTab.value).component
})