import { ref } from "vue";
import { currentModelController } from "../../store";
import gsap from "gsap";
import { FrontSide } from "three";


export const modelControllerViewSetterOptions = ref([
    {
        name:'正视图',
        handle(){
            currentModelController.value.cameraController.setFrontView() 
        }
    }
])



export const isRecordingEnabled = ref(false);

const isAnimating = ref(false);

function startRecord() {
    if (!isRecordingEnabled.value) {
        return;
    }

    currentModelController.value.startMediaRecord();
}

function stopRecord() {
    if (!isRecordingEnabled.value) {
        return;
    }
    currentModelController.value.stopMediaRecord();
}

export const animations = [
    {
        title: "拉远再拉近",
        handle() {
            startRecord();
            let camera = currentModelController.value.camera;
            gsap.to(camera.position, {
                x: 5 * Math.cos(Math.PI / 4), // 初始位置
                z: 5 * Math.sin(Math.PI / 4),
                duration: 1,
                ease: "none",
                repeat: 1,
                yoyo: true,
                onComplete: () => {
                    stopRecord();
                },
            });
        },
    },
    {
        title: "淡入",
        async handle() {
            await fadeInScene(currentModelController.value.scene, 4)
            console.log('动画结束')
        },
    },
    {
        title: "摇晃",
        async handle() {
   
            let mesh = currentModelController.value.mesh

            // 使用 GSAP 实现左右摇晃动画
            gsap.to(mesh.rotation, {
                duration: 2,
                y: `+=${1}`, // 向右摇晃
                yoyo: true, // 动画反向播放
                repeat: 3, // 无限重复
                ease: "sine.inOut" // 缓动效果
            });
        },
    },
];


/**
 *  @method 模型淡入效果
 * */
async function fadeInScene(scene, duration) {
    const fadePromises = []; // 存储所有淡入动画的 Promise

    // 遍历场景中的所有对象
    scene.traverse((object) => {
        if (object.isMesh) {
            // 确保材质支持透明度并设置为只渲染正面
            object.material.transparent = true;
            object.material.opacity = 0; // 初始为完全透明

            // 创建一个 Promise 来处理淡入动画
            const fadePromise = new Promise((resolve) => {
                gsap.to(object.material, {
                    duration: duration,
                    opacity: 1, // 最终透明度为1（完全不透明）
                    onStart: () => {
                        object.material.transparent = true; // 开始时启用透明
                    },
                    onComplete: resolve // 动画完成时解析 Promise
                });
            });

            fadePromises.push(fadePromise); // 将 Promise 添加到数组中
        }

        // 处理 DecalGeometry（如果有的话）
        if (object.isMesh && object.geometry.type === 'DecalGeometry') {
            object.material.transparent = true;
            object.material.opacity = 0;

            const fadePromise = new Promise((resolve) => {
                gsap.to(object.material, {
                    duration: duration,
                    opacity: 1,
                    onStart: () => {
                        object.material.transparent = true;
                    },
                    onComplete: resolve // 动画完成时解析 Promise
                });
            });

            fadePromises.push(fadePromise); // 将 Promise 添加到数组中
        }
    });

    // 等待所有淡入动画完成
    await Promise.all(fadePromises);
}




