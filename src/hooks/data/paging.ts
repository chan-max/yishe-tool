/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-17 20:12:02
 * @LastEditors: chan-max 2651308363@qq.com
 * @LastEditTime: 2024-02-15 23:27:53
 * @FilePath: /yishe/src/hooks/data/paging.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { Ref, computed, isReactive, isRef, ref } from 'vue'

/*
    通用分页逻辑
*/



export const usePaging = (getListFn: (params: any) => Promise<any>, options: any) => {

    options = {
        immediate: true,
        pageSize: 30,
        initialList: ref([]),
        callback:null, // 处理每个请求元素的回调
        resListFilter:null, // 请求结果被插入列表前的过滤器，被过滤掉的不会添加到列表中
        itemAdapter:null, // 每个元素适配器
        ...options,
    }

    
    // 列表数据 , 可用外界传入的参数，也可以自身初始化
    const list = options.initialList
    // 当前页数
    const currentPage = ref(0)
    // 总页数
    const totalPage = ref(Infinity)
    // 尺寸
    const pageSize = ref(options.pageSize)
    // 总数
    const total = ref(0)
    // 是否立即触发一次, 默认为true
    const immediate = ref(options.immediate ?? true)
    // 是否正在加载
    const loading = ref(false)

    // 首次加载
    const firstLoading = computed(() => {
        return loading.value && currentPage.value == 1
    })

    // 滚动触发器， 当需要加载时触发该方法即可
    async function getList(params = {}) {
        // 已经请求完所有数据

        if (loading.value) {
            return;
        }

        try {
            currentPage.value++
            if (currentPage.value > totalPage.value) {
                return
            }

            loading.value = true
            let res = await getListFn({
                currentPage: currentPage.value,
                pageSize: pageSize.value,
                ...params
            })

            // 将总页数同步
            totalPage.value = res.totalPage;
            total.value = res.total

            // 该回调函数可用于单独处理列表的每一项
            if (res.list && options.callback) {
                res.list.forEach(options.callback)
            }

            if(options.resListFilter){
                res.list = res.list.filter(options.resListFilter)
            }

            if(options.itemAdapter){
                res.list = res.list.map(options.itemAdapter)
            }

            if (isRef(list)) {
                res.list.forEach((item) => {
                    (list.value as any).push(item)
                })
            } else if (isReactive(list)) {
                res.list.forEach((item) => {
                    list.push(item)
                })
            } else {
                // 未知错误
            }

            loading.value = false
        } catch (e) {
            loading.value = false
        }
    }

    if (immediate.value) {
        getList()
    }


    // 重置分页状态
    function reset(){
        totalPage.value = Infinity
        currentPage.value = 0
        list.value = []
    }

    return {
        currentPage,
        totalPage,
        pageSize,
        list,
        getList,
        total,
        loading,
        reset,
        firstLoading
    }
}