/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-12-30 23:01:45
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2023-12-31 00:51:09
 * @FilePath: /1s/src/components/design/utils/url.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by 1s, All Rights Reserved. 
 */


/*
    创建用于扫码上传的图片的链接, 扫码上传文件不需要在移动端登录
*/
export function createUploadImageRedirectUrl(){
    return 'http://172.20.10.10:6699/#/uploadImage'
}