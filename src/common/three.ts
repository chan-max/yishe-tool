import {
    MeshPhongMaterial,
    Mesh,
    DoubleSide,
    MeshStandardMaterial,
    FrontSide,
    BackSide,
    WebGLRenderer
} from 'three'

import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import WebGL from 'three/examples/jsm/capabilities/WebGL.js';


/**
 * @function 返回gltf文件中的主网格
 */
function findMainMeshFromGltf(gltf) {
    let mesh = null;
    gltf.scene.traverse((child) => {
        if (child.isMesh && !mesh) {
            mesh = child;
        }
    });
    return mesh;
}


/**
 * @function 将gltf中的网格合并成一个并返回
*/

function findMainMeshFromGltfAndMergeGeometries(gltf) {
    let mesh = null;
    let geometries = []

    gltf.scene.traverse((child) => {

        if (child.isMesh) {
            const geometry = child.geometry.clone();
            geometry.applyMatrix4(child.matrixWorld); // 应用世界变换
            geometries.push(geometry);
        }

        if (child.isMesh && !mesh) {
            mesh = child
        }

    });

    /**
     * @description 这里负责合并所有的几何体，目的是为了让其能够贴图准确，但是，合并后，之前的模型材质都会失效，原因不知道该应用哪一个
     * */

    let merged = mergeGeometries(geometries)

    const material = createDefaultMaterial()

    // 创建合并后的网格
    const mergedMesh = new Mesh(merged, material);
    gltf.scene = mergedMesh

    return { mergedMesh }
}


function createDefaultMaterial() {
    const material = new MeshStandardMaterial({
        color: 0x777777, // 布料颜色
        metalness: .5,    // 非金属
        roughness: .7,   // 粗糙度
        side: DoubleSide
    });

    return material
}


export default class three {

    constructor() {

        var webglSupport = false

        try {
            new WebGLRenderer({})
            webglSupport = true
        } catch (e) {
            webglSupport = false
        }

        this.isSupport = WebGL.isWebGL2Available() && webglSupport
    }

    isSupport = false

    findMainMeshFromGltf = findMainMeshFromGltf
    findMainMeshFromGltfAndMergeGeometries = findMainMeshFromGltfAndMergeGeometries
    createDefaultMaterial = createDefaultMaterial
}