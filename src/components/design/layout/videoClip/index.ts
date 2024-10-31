import { ref } from "vue";
import { currentModelController } from "../../store";
import gsap from "gsap";

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
        handle() {
            startRecord();

            // 这里需要对主模型和贴花同时处理
            let mesh = currentModelController.value.mesh;
            mesh.material.opacity = 0;

            gsap.to(mesh.material, {
                opacity: 1,
                duration: 2,
                ease: "power1.inOut",
                onComplete: () => {
                    stopRecord();
                },
            });

            currentModelController.value.decalControllers.forEach((decal) => {
                decal.meterial.opacity = 0;
                gsap.to(decal.mesh, {
                    opacity: 1,
                    duration: 2,
                    ease: "power1.inOut",
                    onComplete: () => {
                        stopRecord();
                    },
                });
            })
        },
    },
];