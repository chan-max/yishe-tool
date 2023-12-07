import { setFullscreen } from "@/common/browser";
import { computed, ref, shallowRef, watchEffect, watch, reactive, nextTick } from "vue"

// 当前实例
export const currentController = shallowRef(null);

// 是否为暗色模式
export const isDarkMode = ref(false)

// 加载
export const isLoading = shallowRef(false);

// 当前组件是否全屏
export const isFullScreen = ref(false)

watchEffect(() => setFullscreen(isFullScreen.value))



// 画布背景颜色 
export const canvasBgColor = ref('')

// 画布背景透明度
export const canvasBgOpacity = ref('1')

// 画布颜色随着暗色模式的变化而变化
watchEffect(() => {
    canvasBgColor.value = isDarkMode.value ? '#1d1d1d' : '#f2f2f2'
})

// 是否展示基础模型选择菜单
export const showBaseModelSelect = ref(false);

// 当前操作的模型信息
export const currentOperatingModelInfo = ref()

// 是否展示场景控制弹窗
export const showSceneControl = ref(false)

// 是否展示图片贴图的弹窗
export const showImageSticker = ref(false)

watch(showImageSticker, (value) => {
    if (value) {

    }
})

// 是否展示艺术字弹窗
export const showTextSticker = ref(false)


// 是否展示工作台窗口
export const showWorkspace = ref(false)
watch(showWorkspace, (value) => {
    if (value) {
        showDecalControl.value = false
    }
})


// 是否展示贴画控制弹窗
export const showDecalControl = ref(false)
watch(showDecalControl, (value) => {
    if (value) {
        clearRightLayout()
        showDecalControl.value = true
    }
})


// 是否展示自定义文字贴纸
export const showCustomTextSticker = ref(false)
watch(showCustomTextSticker, (value) => {
    if (value) {
        clearLeftLayout()
        showCustomTextSticker.value = true
    }
})


// 当前正在操作的贴花
export const operatingDecal = shallowRef()

// 是否展示图片上传弹窗
export const showImageUplaod = ref(false)


// 是否展示字体上传弹窗
export const showFontUpload = ref(false)


// 是否展示字体列表
export const showFontList = ref(false)

watch(showFontList, (value) => {
})


// 是否展示已使用的贴纸列表
export const showDecalList = ref(false)
watch(showDecalList, async (value) => {
    if (value) {
        clearRightLayout()
        showDecalList.value = true
    }
})

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

// 自定义贴纸的信息
export const operatingTextStickerStyle = reactive({
    fontFamily: '',
})

// 清空左侧布局
export function clearLeftLayout() {
    showImageSticker.value = false
    showCustomTextSticker.value = false
    showTextSticker.value = false
}

// 清空右侧布局
export function clearRightLayout() {
    showDecalList.value = false
    showModelInfo.value = false
    showWorkspace.value = false
    showDecalControl.value = false
}


// 清空所有布局元素
export function clearLayout() {
}


// 记录当前正在操作的贴纸信息
export const operatingTextStickerOptions = reactive({
    // 贴纸内容
    content: `breaking
            bad`,
    // text color
    fontColor: '#6900ff',
    fontGradientColor: '#6900ff',
    // font-weight
    fontWeight: 500,
    // font-size
    fontSize: 30,
    // line-height rem
    lineHeight: 1,
    // font-style italic
    italic: false,
    // letter-spacing
    letterSpacing: .1,

    fontFamilyId: '0',

    // 背景颜色
    backgroundColor: 'rgba(0,0,0,0)',
    backgroundGradientColor:'#6900ff',
    backgroundBorderRadius: '5px',
    backgroundPadding: '',
})

export const operatingTextStickerWritingMode = ref('initial')
export const enum TextStickerWritingMode {
    INITIAL = 'initial',
    VERTICAL_RL = 'vertical-rl',
    VERTICAL_LR = 'vertical-lr',
}

export const operatingTextStickerTextOrientation = ref('upright')
