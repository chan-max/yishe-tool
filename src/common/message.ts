import { Modal } from "ant-design-vue"



export const s1Confirm = (opt = {}) => {
    return new Promise((resolve, reject) => {
        Modal.confirm({
            centered:true,
            okText:'确定',
            cancelText:'取消',
            ...opt,
            onOk: () => {
                resolve(void 0)
            },
            onCancel: () => {
                reject('confirm is cancelled')
            }
        })
    })
}