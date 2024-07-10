import { ref } from 'vue'
import svgLoading from './loading.svg?raw'
import listbottomLoading from './list-bottom.svg?raw'

export const LoadingOptions = ref({
    'element-loading-text': '', //	显示在加载图标下方的加载文案	
    'element-loading-spinner': svgLoading,//	自定义加载图标	
    'element-loading-svg': '',	// 自定义加载图标 (与 element-loading-spinner 相同)	
    'element-loading-background': 'rgba(255,255,255,.9)',
    'element-loading-svg-view-box':"0, 0, 200, 200"
})


export enum LoadingType {
    COMMON,
    LIST_BOTTOM,
}

function creaateLoadingOptions(options:any = {}){
   return {
        'element-loading-text': options.text, //	显示在加载图标下方的加载文案	
        'element-loading-spinner': options.svg || svgLoading,//	自定义加载图标	
        'element-loading-svg': '',	// 自定义加载图标 (与 element-loading-spinner 相同)	
        'element-loading-background':options.background || 'rgba(255,255,255,.9)',
        'element-loading-svg-view-box':options.viewBox || "0, 0, 200, 200"
    }
}

export const  useLoadingOptions = (options) => {
    return creaateLoadingOptions(options)
}


import hloading from './h.svg?url'

export const loadingBottom = () => {
    return <div style='display:flex;align-items:center;justify-content:center;'>
        <img style="width:36px;height:36px;" src={hloading}></img>
    </div>
}

