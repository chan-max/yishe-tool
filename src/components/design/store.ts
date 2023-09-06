import { setFullscreen } from "@/common/browser";
import { computed, ref, shallowRef, watchEffect,watch } from "vue"

// 是否为暗色模式
export const isDarkMode = ref(false)

// 加载
export const isLoading = shallowRef(false);

// 模型的加载元素
export const container = shallowRef();

// 保存当前引入的文件
export const currentGltf = shallowRef()

// 保存引入文件场景中的模型
export const currentModel = shallowRef()

// 保存当前模型的材质
export const currentMaterial = shallowRef()

// 保留最重要的 canvas 元素 , 用于报存贴图信息
export const textureCanvas = shallowRef()

// 材质canvas抽象类
export const currentCustomTextureCanvas = shallowRef()

// 当前组件是否全屏
export const isFullScreen = ref(false)

watchEffect(() => setFullscreen(isFullScreen.value))


// 是否展示背景控制表单
export const isShowBgControlForm = ref(false)

// 画布背景颜色 
export const canvasBgColor = ref('')

// 画布背景透明度
export const canvasBgOpacity = ref('1')


// 画布颜色随着暗色模式的变化而变化
watchEffect(() => {
    canvasBgColor.value = isDarkMode.value ? '#181818' : '#eee'
})

// 是否展示基础模型选择菜单
export const showBaseModelSelectDialog = ref(false);

// 当前选中的模型文件路径
export const currentModelFilePath = ref()

// 当前操作的模型信息
export const currentModelInfo = ref()

// 是否展示场景控制弹窗
export const showSceneControlDialog = ref(false)

// 是否展示图片贴图的弹窗
export const showImageStickerDialog = ref(false)

// 是否展示艺术字弹窗
export const showWordArtDialog = ref(false)

// 保存弹窗当前的zIndex
export const zIndexDialog = ref(10)

// 文字贴纸文字
export const textStickerText = ref('1s.design')

// 文字贴纸颜色
export const textStickerColor = ref('#000')






