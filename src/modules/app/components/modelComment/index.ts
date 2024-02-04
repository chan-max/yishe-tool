/*
* @Author: chan-max jackieontheway666@gmail.com
* @Date: 2024-01-11 20:37:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-04 21:37:16
 * @FilePath: /1s/src/modules/app/components/modelComment/index.ts
* @Description: 
* 
* Copyright (c) 2024 by 1s, All Rights Reserved. 
*/
import { ref, shallowRef, Ref } from 'vue'
import { modalController } from '@ionic/vue';
import comment from './comment.vue'
import { CommentSortType } from '@/api/api/comment';


// 是否打开弹层
export const isOpen = ref(false);

// 评论的排序类型
export const sortType: Ref<CommentSortType> = ref(CommentSortType.LATEST)

export function toggleSort(){
  sortType.value = sortType.value == CommentSortType.HOTEST ? CommentSortType.LATEST : CommentSortType.HOTEST
}

// 弹窗信息
export const modelInfo = shallowRef()

export async function openModelComment(_modelInfo) {
  modelInfo.value = _modelInfo
  const modal = await modalController.create({
    component: comment,
    breakpoints: [0, 1],
    initialBreakpoint: 1,
    cssClass:'model-comment'
  });
  modal.present();
}








