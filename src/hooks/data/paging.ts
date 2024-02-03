/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-02-03 21:29:34
 * @FilePath: /1s/src/hooks/data/paging.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { Ref, computed, ref } from 'vue'

/*
    通用分页逻辑
*/

export interface UsePaging {
    page: Ref,
    pages: Ref,
    pageSize: Ref,
    list: Ref,
    getList: any,
}

export const usePaging = (getListFn:(params:any)=>Promise<any>, options:any) => {

    options = {
        immediate:true,
        pageSize:30,
        ...options,
    }

    // 列表数据
    const list = ref([])
    // 当前页数
    const page = ref(0)
    // 总页数
    const pages = ref(Infinity)
    // 尺寸
    const pageSize = ref(options.pageSize)
    // 总数
    const count = ref(0)
    // 是否立即触发一次, 默认为true
    const immediate = ref(options.immediate ?? true)
    
    // 是否正在加载
    const loading = ref(false)

    // 首次加载
    const firstLoading = computed(() => {
        return loading.value && page.value == 1
    })

    // 滚动触发器， 当需要加载时触发该方法即可
    async function getList(params = {}) {
        // 已经请求完所有数据

        if (loading.value) {
            return;
        }

        try {
            page.value++
            if (page.value > pages.value) {
                return
            }
            
            loading.value = true
            let res = await getListFn({
                page: page.value,
                pageSize: 30,
                ...params
            })
            
            pages.value = res.pages;

            // 该回调函数可用于单独处理列表的每一项
            if(res.list && options.callback){
                res.list.forEach(options.callback)
            }

            list.value = list.value.concat(res.list);

            loading.value = false
        } catch (e) {
            loading.value = false
        }
    }

    if (immediate.value) {
        getList()
    }

    return {
        page,
        pages,
        pageSize,
        list,
        getList,
        count,
        loading,
        firstLoading
    }
}