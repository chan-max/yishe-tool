import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'




export const searchText = ref()

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

export const  mobileMarketTabs = ref([
    {
      index: "1",
      title: " T恤",
    },
    {
      index: "2",
      title: " 卫衣",
    },
    {
      index: "3",
      title: "背心",
    },
    {
      index: "4",
      title: "短裤",
    },
    {
      index: "5",
      title: "员工服",
    },
    {
      index: "6",
      title: "工作服",
    },
  ]);