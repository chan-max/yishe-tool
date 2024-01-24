/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2023-11-26 11:13:28
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-13 17:13:50
 * @FilePath: /1s/src/common/threejsHelper.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { GLTFLoader, } from "three/examples/jsm/loaders/GLTFLoader";
import {TextureLoader} from 'three'


export function gltfLoader(url) {
    let loader = new GLTFLoader();
    return new Promise(async (resolve,reject) => {
        try{
            let gltf = await loader.loadAsync(url)
            resolve(gltf)
        }catch(e){
            reject(e)
        }
    })
}


export function textureLoader(url){
    const loader = new TextureLoader();
    return new Promise(async (resolve,reject) => {
        let _url = import.meta.env.DEV ? `api/${url}` : url
        let texture = await loader.loadAsync(_url)
        resolve(texture)
    })
}
