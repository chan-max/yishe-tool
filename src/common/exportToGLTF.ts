
export function exportToGLTF(data: any, filename: any = 'model') {

    if (typeof data === 'object') {
        data = JSON.stringify(data)
    }

    // dada 表示要转换的字符串数据，type 表示要转换的数据格式
    const blob = new Blob([data], {
        type: 'text/gltf'
    })

    const objectURL = URL.createObjectURL(blob)

    const aTag = document.createElement('a')

    aTag.href = objectURL

    aTag.download = filename + '.gltf'

    aTag.click()
    URL.revokeObjectURL(objectURL)
}

import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

export function sceneExportToGLTF(scene: any, filename: any) {
    const exporter = new GLTFExporter();

    // Parse the input and generate the glTF output
    exporter.parse(
        scene,
        // called when the gltf has been generated
        function (gltf: any) {
            console.log(gltf);
            exportToGLTF(gltf);
        },
        // called when there is an error in the generation
        function (error: any) {
            console.log("An error happened");
        }
    );
}