/*
* @Author: chan-max jackieontheway666@gmail.com
* @Date: 2024-01-11 20:37:37
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-05 08:59:16
 * @FilePath: /1s/src/modules/app/components/modelComment/index.ts
* @Description: 
* 
* Copyright (c) 2024 by 1s, All Rights Reserved. 
*/
import { ref, shallowRef, Ref } from 'vue'
import { modalController } from '@ionic/vue';
import { CommentSortType } from '@/api/api/comment';


// 是否打开弹层
export const isOpen = ref(false);

// 评论的排序类型
export const sortType: Ref<CommentSortType> = ref(CommentSortType.LATEST)

export function toggleSort(){
  sortType.value = sortType.value == CommentSortType.HOTEST ? CommentSortType.LATEST : CommentSortType.HOTEST
}









