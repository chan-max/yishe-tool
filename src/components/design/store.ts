import { setFullscreen } from "@/common/browser";
import { useDebounceFn, useLocalStorage } from "@vueuse/core";
import { computed, ref, shallowRef, watchEffect, watch, nextTick, reactive, toRaw } from "vue"
import { defineStore } from "pinia";
import Utils from '@/common/utils'
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from 'deep-object-diff';
import Api from '@/api'
import { message } from 'ant-design-vue'
import { uploadToCOS, createDraft } from '@/api'
import { saveAs } from 'file-saver';

// 当前实例
export const currentModelController = shallowRef(null);

// 截屏组件实例
export const screenshotInstance = ref();

// 所有截屏
export const screenshots = ref([])

export const lastestScreenshot = computed(() => {
    return screenshots.value[screenshots.value.length - 1]
})

export function saveScreenshot() {
    const base64 = currentModelController.value.getScreenshotBase64();
    screenshotInstance.value.execScreenshot(base64);

    if (screenshots.value.length >= 20) {
        screenshots.value.shift()
        message.warning('最多保存20张,超出会移除最早的截图')
    }

    screenshots.value.push({
        base64: base64,
        createdTime: new Date(),
    })

    // 保存到本地
    const file = Utils.transform.base64ToPngFile(base64);

    // saveAs(file, `screenshot_${new Date().getTime()}.png`);

    // 上传到 COS 并保存到草稿箱
    uploadToCOS({ file }).then(cos => {
        createDraft({
            url: cos.url,
            name: '模型截图',
            updateTime: new Date(),
            ...(isEdit.value && currentEditingModelId.value ? { customModelId: currentEditingModelId.value } : {})
        }).then(() => {
            message.success('截图已保存到草稿箱和本地');
        }).catch(err => {
            message.error('保存到草稿箱失败');
            console.error(err);
        });
    }).catch(err => {
        message.error('上传截图失败');
        console.error(err);
    });
}




// 是否为暗色模式
export const isDarkMode = ref(false)

// 加载
export const isFirstPageLoading = shallowRef(true);

// 当前组件是否全屏
export const isFullScreen = ref(false)

watchEffect(() => setFullscreen(isFullScreen.value))

// 画布背景颜色 
export const canvasBgColor = ref(0x000000)

// 画布背景透明度
export const canvasBgOpacity = ref('0')

// 画布颜色随着暗色模式的变化而变化

// 是否展示基础模型选择菜单
export const showBaseModelSelect = ref(false);

// 当前操作的模型信息 , 如果不提供默认值 ， 会出现 【object】的问题
export const currentOperatingBaseModelInfo = ref({} as any)

// 是否展示场景控制弹窗
export const showSceneControl = ref(false)

// 是否展示图片贴图的弹窗
export const showImageSticker = ref(false)

// 是否展示艺术字弹窗
export const showTextSticker = ref(false)

// 是否展示工作台窗口
export const showWorkspace = ref(false)
watch(showWorkspace, (value) => {
    if (value) {
        clearLeftLayout()
        showWorkspace.value = true
    }
})


// 是否展示贴画控制弹窗
export const showDecalControl = ref(false)
watch(showDecalControl, (value) => {
    if (value) {
        clearLeftLayout()
        showDecalControl.value = true
    }
})


// 展示自定义模型
export const showCustomModel = ref(false)

// 是否展示自定义文字贴纸
export const showCustomTextSticker = ref(false)


// 当前正在操作的贴花实例
export const currentOperatingDecalController = shallowRef()


/*
  切换主模型
  需要保留之前的操作
*/

watch(
    currentOperatingBaseModelInfo,
    async () => {
        if (!currentOperatingBaseModelInfo.value?.url || currentModelController.value?.isUsingModelInfo ) {
            return;
        }
        await nextTick();
        currentModelController.value?.setMainModel(currentOperatingBaseModelInfo.value?.url);
    },
    {
        immediate: true,
    }
);


// 改变画布背景颜色
watchEffect(() => {

    if (!currentModelController.value) {
        return
    }

    return
    currentModelController.value.setBgColor(canvasBgColor.value, canvasBgOpacity.value)
});


/**
 * 模型画布背景设置
*/

export const builtInCanvasBackgrounds = ref([
    {
        id: 'light-gray',
        name: '淡灰色',
        backgroundCss: '#eee'
    },
    {
        id: 'purple-gradient',
        name: '淡紫渐变色',
        backgroundCss: 'linear-gradient(to right, #4e54c8, #8f94fb)'
    },
    {
        id: 'transparent',
        name: '透明',
        backgroundCss: 'transparent'
    },
])


export const currentCanvasBackground = useLocalStorage('_1s_canvasBackground', builtInCanvasBackgrounds.value[0])

/**
 * 画布背景图设置
*/
export const builtInCanvasBackgroundImages = ref([
    {
        id: 'default-bg',
        name: '默认',
        url: '/3d-static-bg/default.jpg',
        description: ''
    },
    {
        id: 'gray-bg',
        name: '灰白背景',
        url: '/3d-static-bg/gray.jpg',
        description: ''
    },
    {
        id: 'base-bg',
        name: '带底盘的',
        url: '/3d-static-bg/2.jpg',
        description: ''
    },
])

export const currentCanvasBackgroundImageId = useLocalStorage('_1s_canvasBackgroundImageId', builtInCanvasBackgroundImages.value[0].id)

// 是否展示字体列表
export const showFontModal = ref(false)

// 是否展示贴纸
export const showSticker = ref(false)
watch(showSticker, async (value) => {
    if (value) {
        clearLeftLayout()
        showSticker.value = true
    }
})


// 是否展示已使用的贴纸列表
export const showDecalList = useLocalStorage('_1s_showDecalList', false)
watch(showDecalList, (value) => {
    if (value) {
        clearRightLayout()
        showDecalList.value = true
    }
})



// 展示徽章
export const showStamp = ref(false)

/* 是否展示上传 */
export const showUpload = ref(false)

// 是否展示模型信息
export const showModelInfo = ref(false)
watch(showModelInfo, async (value) => {
    if (value) {
        clearRightLayout()
        showModelInfo.value = true
    }
})

// 是否展示顶部菜单
export const showHeader = ref(true)

// 是否展示顶部副菜单
export const showSubHeader = ref(true)

export const showLeftMenu = ref(true)

export const showBottomMenu = ref(true)

// 清空左侧布局
export function clearLeftLayout() {
    showCanvasLayout.value = false
    showSticker.value = false
    showDecalControl.value = false
    viewDisplayController.value.showMaterialControl = false
    viewDisplayController.value.showVideoClip = false
    showWorkspace.value = false
}

// 清空右侧布局
export function clearRightLayout() {
    showDecalList.value = false
    showModelInfo.value = false
}


// 展示自定义画布布局
export const showCanvasLayout = ref(false);
watch(showCanvasLayout, (value) => {
    if (value) {
        clearLeftLayout()
        showCanvasLayout.value = true
        // showBasicCanvas.value = true
    } else {
        // showBasicCanvas.value = false
    }
})




// 清空所有布局元素
export function clearLayout() {
}



// 记录当前正在操作的贴纸信息
export const operatingTextStickerOptions = reactive({
})




// 是否展示模型上传弹窗
export const showSaveModel = ref(false)

// 系统是否成功连接 websocket
export const online = ref(false);
watch(online, (value) => {
})



// 是否为编辑模式 ,  分为编辑模式和 新建模式 ， 编辑模式也会分为编辑自己的和其他人的
export const isEdit = ref(false)
// 当前正在编辑的模型信息, 只有为编辑模型时才会赋值
export const currentEditingModelInfo = ref()
// 新增：当前正在编辑的模型ID
export const currentEditingModelId = ref<string | null>(null)


// 模型装饰品
export const showDecoration = ref(false)


/*
 是否展示基础画布
*/
export const showBasicCanvas = computed(() => {
    return (showCanvasLayout.value && showMainCanvas.value)
})

/*
 是否展示3d画布
*/
export const showThreeCanvas = ref(true)


/*
    延迟点击贴纸
*/

export const isUsingClickDelaySticker = ref(false)

export const clickDelaySticker = ref()


/*
    当前页面中使用并加载了哪些字体 , 并且字体是否在加载中
*/
export const cacheFontFamily = ref({})

export const cacheFontFamilyLoadingMap = ref({})




/*
    svg 画布
*/
export const showSvgCanvas = ref(false)

export const svgCanvasChildren = ref([])

// 当前操作画布的宽和高
export const svgCanvasWidth = ref(100)
export const svgCanvasHeight = ref(100)
// 是否展示主画布
export const svgCanvasSyncMainCanvas = ref(false)


export const viewDisplayController = ref({
    showStickerModal: false, // 贴纸模态，主要用于交互操作
    showProject: false, // 是否展示我的项目

    // 是否展示贴纸 
    showDecalControl: false,


    // 服装材料相关弹层
    showMaterialModal: false,
    showMaterialControl: false,


    // 视频剪辑相关功能模块
    showVideoClip: false
})


/*
    所有状态统一使用store管理
*/


import { canvasStickerOptions, currentOperatingCanvasChildId } from '@/components/design/layout/canvas/index.tsx'

import { stickerQueryTags, stickerQueryParams } from "@/components/design/layout/sticker/index.tsx";
import { showMainCanvas } from "@/components/design/layout/canvas/index.tsx";


// 当前仓库的名字
export const storageName = ref('')



/**
 * @define 当前工作台添加的本地文件。可以使用或上传
*/

export const currentWorkspaceLocalFiles = ref([])

/*
    最近更新时间
*/
export const lastModifiedTime = ref()


/**
 * @define 当前系统 用户在本地选择的文件资源
*/
export const localFileListResource = ref([])



export const useDesignStore = defineStore('_1s_design', () => {
    return {
        version: null,
        storageName: useLocalStorage('_1s_storageName', storageName),
        showWorkspace: useLocalStorage('_1s_showWorkspace', showWorkspace),
        // lastModifiedTime: useLocalStorage('_1s_lastModifiedTime', lastModifiedTime),
        showBaseModelSelect: useLocalStorage('_1s_showBaseModelSelect', showBaseModelSelect),
        showBasicCanvas: useLocalStorage('_1s_showBasicCanvas', showBasicCanvas),
        showThreeCanvas: useLocalStorage('_1s_showThreeCanvas', showThreeCanvas),
        showSticker: useLocalStorage('_1s_showSticker', showSticker),
        currentOperatingBaseModelInfo: useLocalStorage('_1s_currentOperatingBaseModelInfo', currentOperatingBaseModelInfo),
        showCanvasLayout: useLocalStorage('_1s_showCanvasLayout', showCanvasLayout),
        canvasStickerOptions: useLocalStorage('_1s_canvasStickerOptions', canvasStickerOptions),
        stickerQueryTags: useLocalStorage('_1s_stickerQueryTags', stickerQueryTags),
        currentOperatingCanvasChildId: useLocalStorage('currentOperatingCanvasChildId', currentOperatingCanvasChildId),
        showMainCanvas: useLocalStorage('_1s_showMainCanvas', showMainCanvas),
        viewDisplayController: useLocalStorage('_1s_viewDisplayController', viewDisplayController)
    }
})



// const designStore = useDesignStore();


// /*
//  单独记录时间
// */
// designStore.$subscribe((mutation, state) => {
//     lastModifiedTime.value = new Date()
// }, {
//     deep: true
// })

/*
    同步工作区所有个人状态
*/

/*
    开始同步 
    bug 请李缓存也会视为更改页面状态，也会触发更新
*/


// 同步状态
export const syncState = ref({
    loading: false, // 正在保存中
    success: false, // 成功
    failed: false // 失败
})

export function startSyncDesignStorage() {

    let sync = useDebounceFn(function sync(state) {

        let currentState = Utils.deepUnref(state)

        try {
            Api.updateUserMeta({
                metaKey: 'designStorage',
                data: {
                    ...currentState,
                    lastModifiedTime: lastModifiedTime.value
                }
            })
            syncState.value.success = true
        } catch (e) {
            syncState.value.failed = true
        } finally {
            syncState.value.loading = false
        }

    }, 999)



    designStore.$subscribe((mutation, state) => {
        syncState.value.loading = true
        sync(state)
    }, {
        deep: true,
    })

}


// 是否展示截屏抽屉
export const showScreenshotDrawer = ref(false)

export { currentHoveringDecalController } from '@/components/design/core/decalController'


// 进入编辑模式
export function enterEditMode(modelId: string, modelInfo?: any) {
    isEdit.value = true;
    currentEditingModelId.value = modelId;
    if (modelInfo) {
        currentEditingModelInfo.value = modelInfo;
    }
}
// 退出编辑模式
export function exitEditMode() {
    isEdit.value = false;
    currentEditingModelId.value = null;
    currentEditingModelInfo.value = null;
}


// 角度选择全局状态
export const selectedAngles = ref<string[]>([]);

