import { shallowRef } from "vue"

// 是否展示素材菜单
 export const showRightMenu = shallowRef(true);

// 当前选择的模型名称 

export const currentFilename = shallowRef('shirt_white.glb')

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
