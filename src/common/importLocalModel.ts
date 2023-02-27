import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/*
    导入本地模型 , 只能导入一个, 目前只支持 glb ，gltf 返回一个实例
*/

function fileToBuffer(file: any) {
    return new Promise((resolve: any) => {
        var fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.addEventListener("loadend", (e: any) => {
            resolve(e.target.result)
        });
    })
}

export async function importLocalModel() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".glb,.gltf";
    input.multiple = false;
    input.dispatchEvent(new MouseEvent('click'))
    return new Promise((resolve, reject) => {
        input.onchange = async (e: any) => {
            const loader = new GLTFLoader();
            let buffer = await fileToBuffer(e.target.files[0])
            loader.parse(buffer, '', (gltf: any) => {
                resolve(gltf);
            })
        };
    });
}