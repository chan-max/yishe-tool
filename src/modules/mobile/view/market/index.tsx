import { useLocalStorage } from '@vueuse/core'
import { ref, computed, onBeforeMount } from 'vue'
import Api from '@/api'


/**
 * @define 本地搜素记录 , 最多保存 15 条
*/

export const localSearchRecords = useLocalStorage('_1s_mobile_market_search_records', [])

// 添加搜索记录
export function addSearchRecords(textOpt) {

    if (!textOpt) {
        return
    }

    if (localSearchRecords.value.length >= 15) {
        localSearchRecords.value.shift()
    }
    localSearchRecords.value.push(textOpt)

}


/**
 *  热门搜索标签
*/
export const hotSearchOptions = ref([{
    label: 'T恤',
    suffix: '热',
    suffixColor: '#f00'
}, {
    label: '卫衣'
}, {
    label: '背心'
}, {
    label: '运动服'
}, {
    label: '情侣装'
}, {
    label: '潮牌'
}, {
    label: '工作服'
}, {
    label: '奢侈品'
}, {
    label: '同款',
    suffix: '最多搜索',
    suffixColor: '#f00'
}, {
    label: '折扣'
}
])

// 是否显示搜索菜单
export const showSearchMenu = ref(false)




// 商品卡背景色
export const bgs = ref([
    "#FCE8EA",
    "#F9E2D0",
    "#E4FBEB",
    "#CCF3F6",
    "#FEE0C6",
    "#CEE9FE",
    "#E2F4F7",
    "#F8E3C4",
    "#D6E9D6",
    "#B2E0E6",
    "#E5D5F1",
    "#D9EAD3",
    "#A4D9E1",
]);

export const mobileMarketTabs = ref([
    {
        index: "0",
        title: " 全部",
        match: ''
    },
    {
        index: "1",
        title: " T恤",
        match: 'T恤'
    },
    {
        index: "2",
        title: " 卫衣",
        match: '卫衣'
    },
    {
        index: "4",
        title: "短裤",
        match: '短裤'
    },
    {
        index: "6",
        title: "工作服",
        match: '工作服'
    },
    {
        index: "5",
        title: "员工服",
        match: '员工服'
    },
]);



export function getOptionsValue(options, value, opt?) {
    opt = {
        outputKey: 'text',
        inputKey: 'value',
        ...opt
    }

    for (let i = 0; i < options.length; i++) {
        let item = options[i];
        if (item[opt.inputKey] == value) {
            return item[opt.outputKey]
        }
    }

    return null
}



export const queryParams = ref({
    searchText: '',
    priceOrderBy: null,
    createTimeOrderBy: null,
    baseModelId: null,
    color: null,
    customizable: null,
});

export const priceDropdownMenuOptions = ref([
    {
        text: "不考虑价格",
        value: null,
    },
    {
        text: "按价格降序",
        value: "DESC",
    },
    {
        text: "按价格升序",
        value: "ASC",
    },
]);



// 这里的value是用来显示用的
export const colorDropMenuOptions = ref([
    { text: "红色", value: "red" },
    { text: "绿色", value: "green" },
    { text: "蓝色", value: "blue" },
    { text: "黑色", value: "black" },
    { text: "白色", value: "white" },
    { text: "黄色", value: "yellow" },
    { text: "紫色", value: "purple" },
    { text: "橙色", value: "orange" },
    { text: "灰色", value: "gray" },
    { text: "粉色", value: "pink" },
    { text: "棕色", value: "brown" },
    { text: "青色", value: "cyan" },
    { text: "洋红", value: "magenta" },
    { text: "金色", value: "#FFD700" },
    { text: "银色", value: "#C0C0C0" },
])

export const createTimeDropdownMenuOptions = ref([
    {
        text: "默认时间排序",
        value: null,
    },
    {
        text: "按时间降序(最新)",
        value: "DESC",
    },
    {
        text: "按时间升序",
        value: "ASC",
    },
]);

export const customizableDropdownMenuOptions = ref([
    {
        text: "是否可定制",
        value: null,
    },
    {
        text: "可定制",
        value: '1',
    },
    {
        text: "不可定制",
        value: '0',
    },
]);


export function useDropdownMenuMixin() {

    let baseModelList = ref([])

    onBeforeMount(async () => {
        let res = await Api.getProductModelList({ currentPage: 1, pageSize: 999 })
        baseModelList.value = res.list
    })

    return {
        baseModelList
    }
}


export const menuRef = ref(null);

