import { GLTFLoader, } from "three/examples/jsm/loaders/GLTFLoader";
import {TextureLoader} from 'three'


export function gltfLoader(url) {
    let loader = new GLTFLoader();
    return new Promise(async (resolve,reject) => {
        let gltf = await loader.loadAsync(url)
        resolve(gltf)
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
