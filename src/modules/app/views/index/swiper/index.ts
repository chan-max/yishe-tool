import {ref} from 'vue'


// 当前正在显示的索引
export const activeIndex = ref(0);


export function activeIndexChange(params) {
  activeIndex.value = params.activeIndex;
}