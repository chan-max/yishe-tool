import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export function gltfLoader(url) {
    let loader = new GLTFLoader();
    return new Promise(async (resolve,reject) => {
        let _url = import.meta.env.DEV ? `api/${url}` : url
        let gltf = await loader.loadAsync(_url)
        resolve(gltf)
    })
}