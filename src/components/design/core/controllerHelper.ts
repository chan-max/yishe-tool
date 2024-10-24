import Api from '@/api'
import {
    Box3,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    AmbientLight,
    Vector3,
    Box3Helper,
    Vector2,
    Object3D,
    SphereGeometry,
    DoubleSide,
    Raycaster,
    Texture,
    Euler,
    MeshPhongMaterial,
    TextureLoader,
    CubeTextureLoader,
    BackSide,
    PointLight,
    MathUtils,
    PMREMGenerator,
    MeshStandardMaterial,
    RepeatWrapping
} from "three";
import { message } from 'ant-design-vue'
import three from '../../../common/three';
import Utils from '@/common/utils'


export async function createMaterialFromOptions(options) {

    let {
        textureInfo,
        color,
        metalness,
        roughness
    } = options


    message.loading({ content: `正在生成材质...`, key: 'loadingmaterial', duration: 0 });

    let map = null

    if (textureInfo) {


        let textrue = textureInfo

        const textureLoader = new TextureLoader();
        textureLoader.setWithCredentials(true)
        textureLoader.setCrossOrigin('*')

        let texture = await textureLoader.loadAsync(textrue.url)

        // 该段代码可以将纹理均匀的显示
        texture.wrapS = RepeatWrapping; // 设置水平重复
        texture.wrapT = RepeatWrapping; // 设置垂直重复


        // 设置纹理的密度
        texture.repeat.set(2, 2); // 设置重复次数
        texture.offset.set(0, 0); // 设置偏移

        map = texture
    }



    const material = new MeshStandardMaterial({
        map: map,
        // color: 0x777777, // 布料颜色
        metalness: metalness,    // 金属
        roughness: roughness,   // 粗糙度
        side: DoubleSide,
        color: color,
    });

    message.destroy('loadingmaterial');
    return material
}


export function initBasicLight(scene) {

    // 创建场景、相机和渲染器等...
    // 添加环境光
    const ambientLight = new AmbientLight(0xffffff, 1.2); // 设置颜色和强度
    scene.add(ambientLight);

    // // 添加平行光
    const directionalLight1 = new DirectionalLight(0xffffff, 1.2); // 设置颜色和强度
    directionalLight1.position.set(1, 1, 1); // 设置光源位置
    scene.add(directionalLight1);

    // 添加平行光
    const directionalLight2 = new DirectionalLight(0xffffff, 1.2); // 设置颜色和强度
    directionalLight2.position.set(-1, -1, -1); // 设置光源位置
    scene.add(directionalLight2);

    // 添加点光源
    const pointLight = new PointLight(0xffffff, 5); // 设置颜色和强度
    pointLight.position.set(0, 0, 4); // 设置光源位置
    scene.add(pointLight);
}