
import COS from 'cos-js-sdk-v5';
import { useConfigStore } from '@/store/stores/config';
import { saveAs } from 'file-saver';

var _cos
export const getCOS = () => {

    let configStore = useConfigStore()

    if (_cos) {
        return _cos
    }


    _cos = new COS({
        SecretId: configStore.cos.SecretId,
        SecretKey: configStore.cos.SecretKey,
        Bucket: configStore.cos.Bucket,
        Region: configStore.cos.Region,
    } as any)

    return _cos
}



export async function uploadToCOS({
    file,
    key = new Date().getTime() + '_1s_' + file.name,
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
            url: `https://${res.Location}`,
            key
        }
    } catch (e) {
        throw e
    }
}


export function deleteCOSFile(key) {
    return new Promise((resolve, reject) => {
        const cos = getCOS();

        key = String(key)
        cos.deleteObject({
            Bucket: cos.options.Bucket,
            Region: cos.options.Region,
            Key: key
        }, function (err, data) {
            if (err) {
                console.error('删除文件失败:', err);
                reject(err);
            } else {
                console.log('删除文件成功:', data);
                resolve(data);
            }
        });
    });
}


function removeProtocol(url) {
    if (url.startsWith('http://')) {
        return url.replace('http://', '')
    }

    if (url.startsWith('https://')) {
        return url.replace('https://', '')
    }
}

export function downloadCOSFile(key) {
    let filename = key.split('_1s_')[1]
    if (!filename) {
        return
    }
    return saveAs(key, filename)
}


