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
import { Ref, computed, isReactive, isRef, ref, watch } from 'vue'
import { length } from '../../../node_modules/@types/three/src/nodes/math/MathNode.d';

/*
    通用分页逻辑
*/



export const usePaging = (getListFn: (params: any) => Promise<any>, options: any = {}) => {

    options = {
        immediate: true,
        pageSize: 30,
        initialList: ref([]) as any,
        callback: null, // 处理每个请求元素的回调
        filter: null, // 请求结果被插入列表前的过滤器，被过滤掉的不会添加到列表中
        forEach: null,
        autofillColumns: null, // 这是一个特殊的参数， 当传递了该参数时，如何列表的数据不能被该列整除时，会自动填充满该数组
        isSinglePageMode: false,
        ...options,
    }

    // 列表数据 , 可用外界传入的参数，也可以自身初始化
    const list = options.initialList as any
    // 当前页数
    const currentPage = ref(options.currentPage || 0)
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


    //  是否为单页模式
    const isSinglePageMode = ref(options.isSinglePageMode)

    // 首次加载
    const firstLoading = computed(() => {
        return loading.value && currentPage.value == 1
    })

    // 非首次加载
    const subsequentLoading = computed(() => {
        return loading.value && currentPage.value != 1
    })


    // 只清空数据

    function resetList() {
        if (isRef(list)) {
            list.value = []
        } else if (isReactive(list)) {
            list.splice(0, list.length);
        }
    }

    // 滚动触发器， 当需要加载时触发该方法即可
    async function getList(params = {}) {
        // 已经请求完所有数据
        if (loading.value) {
            return;
        }

        try {

            // 非单页模式处理
            if (!isSinglePageMode.value) {

                if (currentPage.value + 1 > totalPage.value) {
                    return
                }

                currentPage.value++
            } else {
                if (currentPage.value == 0) {
                    currentPage.value = 1
                }
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

            if (options.filter) {
                res.list = res.list.filter(options.filter)
            }

            if (options.forEach) {
                res.list.forEach(options.forEach)
            }


            if (isSinglePageMode.value) {
                resetList()
            }

            if (isRef(list)) {
                res.list.forEach((item) => {
                    (list.value as any).push(item)
                })

            } else if (isReactive(list)) {
                res.list.forEach((item) => {
                    list.push(item)
                })
            }

        } catch (e) {
            console.error('use paging error', e)

        } finally {
            loading.value = false
        }
    }

    if (immediate.value) {
        getList()
    }


    // 重置分页状态
    function reset() {
        totalPage.value = Infinity
        currentPage.value = 0
        list.value = []
    }

    // 是否在最后一页
    const isLastPage = computed(() => {
        return (currentPage.value == totalPage.value) && !loading.value
    })


    // 是否为空数据
    const isEmpty = computed(() => {
        return total.value == 0 && !loading.value
    })

    // 当前页数和尺寸改变时重新加载
    if (isSinglePageMode.value) {
        watch([pageSize, currentPage], () => {
            if (loading.value) {
                return;
            }
            getList()
        })
    }


    // 重新请求当前数据
    async function refresh() {
        await getList()
    }

    const filledList = computed(() => {
        if (!options.autofillColumns) {
            return list.value
        } else {

            // 余数
            let remainder = list.value.length % options.autofillColumns

            return [...list.value, ...Array.from({ length: options.autofillColumns - remainder })]
        }
    })



    return {
        currentPage, // 当前页数
        totalPage, // 总页数
        pageSize, // 每夜数量
        list: filledList, // 数据列表
        getList, // 获取数据的方法
        total, // 总数量
        loading, // 是否正在加载
        reset, // 重置列表
        firstLoading, // 首次加载
        subsequentLoading, // 非首次加载
        isLastPage, // 是否到达最后一页
        isEmpty, // 数据是否为空
        refresh,
    }
}