import { ref } from "vue";
import { currentModelController } from "../../store";
import { isEdit, currentEditingModelInfo } from '../../store';
import gsap from "gsap";
import { FrontSide } from "three";
import { message } from "ant-design-vue";
import { uploadToCOS, createDraft } from "@/api";

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

// 处理录制结束后的视频保存
const handleRecordedVideo = async (blob: Blob) => {
  try {
    // 创建文件对象
    const file = new File([blob], `录制视频_${new Date().getTime()}.webm`, { type: 'video/webm' });
    
    // 上传到 COS
    const cos = await uploadToCOS({ file });
    
    // 保存到草稿箱
    await createDraft({
      url: cos.url,
      name: '模型录制视频',
      updateTime: new Date()
    });
    
    message.success('视频已保存到草稿箱');
  } catch (err) {
    message.error('保存视频失败');
    console.error(err);
  }
};

function startRecord() {
    if (!isRecordingEnabled.value) {
        return;
    }

    currentModelController.value.startMediaRecord({
        onStop: handleRecordedVideo
    });
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
            if (isRecordingEnabled.value) {
                startRecord();
            }
            let camera = currentModelController.value.camera;
            gsap.to(camera.position, {
                x: 5 * Math.cos(Math.PI / 4), // 初始位置
                z: 5 * Math.sin(Math.PI / 4),
                duration: 1,
                ease: "none",
                repeat: 1,
                yoyo: true,
                onComplete: () => {
                    if (isRecordingEnabled.value) {
                        stopRecord();
                    }
                },
            });
        },
    },
    {
        title: "淡入",
        async handle() {
            if (isRecordingEnabled.value) {
                startRecord();
            }
            await fadeInScene(currentModelController.value.scene, 4);
            if (isRecordingEnabled.value) {
                stopRecord();
            }
        },
    },
    {
        title: "摇晃",
        async handle() {
            if (isRecordingEnabled.value) {
                startRecord();
            }
            let mesh = currentModelController.value.mesh;

            // 使用 GSAP 实现左右摇晃动画
            gsap.to(mesh.rotation, {
                duration: 2,
                y: `+=${1}`, // 向右摇晃
                yoyo: true, // 动画反向播放
                repeat: 3, // 无限重复
                ease: "sine.inOut", // 缓动效果
                onComplete: () => {
                    if (isRecordingEnabled.value) {
                        stopRecord();
                    }
                }
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

export { isEdit, currentEditingModelInfo };




