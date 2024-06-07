
import COS from 'cos-js-sdk-v5';

var _cos
export const getCOS = () => {
    return _cos || (_cos = new COS({
        SecretId: 'AKIDMdmaMD0uiNwkVH0gTJFKXaXJyV4hHmAL',
        SecretKey: 'HPdigqyzpgTNICCQnK0ZF6zrrpkbL4un',
        Bucket: '1s-1257307499',
        Region: 'ap-beijing'
    } as any))
}

export async function uploadToCOS({
    file,
    key = new Date().getTime(),
}) {
    const cos = getCOS();
    try {
        const res = await cos.uploadFile({
            Key: String(key),
            Body: file,
            Bucket: cos.options.Bucket,
            Region: cos.options.Region
        })
        return {
            url: res.Location,
            key
        }
    } catch (e) {
        throw e
    }
}


// 删除
export async function deleteCOSFile(filename) {
    const cos = getCOS();
    // 调用删除文件的方法
    const res =  await cos.deleteObject({
        Bucket: cos.options.Bucket,
        Region: cos.options.Region,
        Key: filename
    });
    return res
}


