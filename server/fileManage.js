import fs from 'fs'
import path, { dirname } from 'path'
import os from 'os'

function getDir(){
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // JS 中，月份是从 0 开始的，所以需要加1，然后转成两位字符串
    const day = String(date.getDate()).padStart(2, '0'); // 转成两位字符串
    const dir = `${year}-${month}-${day}`
    return dir;
}

// 文件上传的路径
export const getUploadPath = () => {
    const dir =  path.join(os.homedir(),'Desktop','file',getDir())
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return dir
}

// 获取已上传文件的相对路径
export function getRePath(_path){
    let basePath = path.join(os.homedir(),'Desktop','file')
    return _path.split(basePath)[1].replace('\\','/')
}






