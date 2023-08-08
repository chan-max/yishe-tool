import { computed, ref, shallowRef, watchEffect } from "vue"

// 是否为暗色模式
export const isDarkMode = ref(true)

// 是否展示素材菜单
 export const showRightMenu = shallowRef(true);

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
export const isFullpage = ref(false)

// 是否展示背景控制表单
export const isShowBgControlForm = ref(false)

// 画布背景颜色 
export const CanvasBgColor = ref('')

// 画布背景透明度
export const CanvasBgOpacity = ref('1')


// 画布颜色随着暗色模式的变化而变化
watchEffect(() => {
    CanvasBgColor.value = isDarkMode.value ? '#181818' : '#eee'
})