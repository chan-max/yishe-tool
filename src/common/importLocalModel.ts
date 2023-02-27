import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
/*
    导入本地模型 , 只能导入一个, 目前只支持 glb ，gltf 返回一个实例
*/

export async function importLocalModel() {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".glb,.gltf";
    input.multiple = false;
    input.dispatchEvent(new MouseEvent('click'))
    return new Promise((resolve, reject) => {
        input.onchange = (e: any) => {
            let file = e.target.files[0]
            let url = URL.createObjectURL(file)
            const loader = new GLTFLoader();
            var fr = new FileReader();
            fr.readAsArrayBuffer(file);
            fr.addEventListener("loadend", (e: any) => {
                let result = e.target.result
                loader.load(url, (gltf: any) => {
                    resolve(gltf);
                })
            });
        };
    });
}