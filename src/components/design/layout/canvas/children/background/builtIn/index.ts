

export enum CustomBackgroundCategory {
    Normal = 'normal',
    Special = 'special',
}

export type CustomBackgroundType = {
    category: CustomBackgroundCategory,
    label: string,
    id: string,
    disabled?: boolean,
    slot: Function
}


import { heixian, honhsemubu ,fensejiandan ,peigenpisa,xiguapi,xiaomifeng,baisebowenqiangzhi,xingkong,muwen,nainiu,micai} from './special.tsx'

export const CustomBackgroundCategoryOptions = [
    {
        label: '常用',
        value: CustomBackgroundCategory.Normal,
        children: [

        ]
    },
    {
        label: '特殊',
        value: CustomBackgroundCategory.Special,
        children: [
            heixian,
            honhsemubu,
            fensejiandan,
            peigenpisa,
            xiguapi,
            xiaomifeng,
            baisebowenqiangzhi,
            xingkong,
            muwen,
            nainiu,
            micai
        ]
    }
]

export const CustomBackgroundList = CustomBackgroundCategoryOptions.reduce((res, item) => {
    if (item.children) {
        return res.concat(item.children)
    } else {
        return res
    }
}, [])

export function queryCustomBackgroundById(id) {
    return CustomBackgroundList.find((item) => item.id == id)
}