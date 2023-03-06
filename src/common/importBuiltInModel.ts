import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export function importBuiltInModel(sourse: any) {
    const loader = new GLTFLoader();
    return new Promise((resolve: any) => {
        loader.load('model/' + sourse, (gltf) => {
            resolve(gltf)
        });
    })
}

