import {Ref, ref} from 'vue'

/*
    通用分页逻辑
*/

export interface UsePaging {
    page:Ref,
    pages:Ref,
    pageSize:Ref,
    list:Ref,
    getList:any,
}

export const usePaging = (getListFn) => {
    // 列表数据
    const list = ref([])
    // 当前页数
    const page = ref(1)
    // 总页数
    const pages = ref(Infinity)
    // 尺寸
    const pageSize = ref(30)
    // 总数
    const count = ref(0)
    // 是否立即触发一次
    const immediate = ref(true)

    // 滚动触发器， 当需要加载时触发该方法即可
    async function getList(params = {}){
        // 已经请求完所有数据
        if (page.value > pages.value) {
            return;
          }
          
        try{
           let res = await getListFn({
            page: page.value++,
            pageSize: 30,
            ...params
           })

           pages.value = res.pages;
           list.value = list.value.concat(res.list);
      
        }catch(e){

        }
    }

    if(immediate.value){
        getList()
    }

    return {
        page,
        pages,
        pageSize,
        list,
        getList,
        count
    }
}