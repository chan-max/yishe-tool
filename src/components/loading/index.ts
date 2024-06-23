import { ref } from 'vue'
import svgLoading from './loading.svg?raw'



export const LoadingOptions = ref({
    'element-loading-text': '', //	显示在加载图标下方的加载文案	
    'element-loading-spinner': svgLoading,//	自定义加载图标	
    'element-loading-svg': '',	// 自定义加载图标 (与 element-loading-spinner 相同)	
    'element-loading-background': 'rgba(255,255,255,.9)',
    'element-loading-svg-view-box':"0, 0, 200, 200"
})

export const  useLoadingOptions = (options) => {
    return LoadingOptions
}