/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-18 19:22:11
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-18 22:05:54
 * @FilePath: /1s/src/modules/app/views/index/swiper/index.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import {ref} from 'vue'


// 当前正在显示的索引
export const activeIndex = ref(0);


export function activeIndexChange(params) {
  activeIndex.value = params.activeIndex;
}

// 预览模型实例
export const gltfViewerRef = ref()
