/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-27 10:56:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-28 20:11:35
 * @FilePath: /1s/src/hooks/device/camera.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import jsQR from "jsqr"
import { Ref, computed, onMounted, ref, onBeforeUnmount } from "vue"


function getPureWidth(el){
    return Number(window.getComputedStyle(el).width.slice(0,-2))
}

function getPureHeight(el){
    return Number(window.getComputedStyle(el).height.slice(0,-2))
}

export enum CameraModeType {
    USER, // 前置
    ENVIROMENT // 后置
}

export const facingModeUserOption = {
    video: {
        width: 1200,
        height: 720,
        facingMode: "user"
    }
}

export const facingModeEnvironmentOption = {
    video: {
        width: 1200,
        height: 720,
        facingMode: { exact: "environment" }
    }
}

export function nextFrame(cb) {
    cb()
    requestAnimationFrame(() => nextFrame(cb));
}

export const useCamera = ({
    videoRef, canvasRef,
}) => {
    // 是否可用
    const disabled = computed(() => {
        return !navigator?.mediaDevices?.getUserMedia
    })

    const mode = ref(CameraModeType.ENVIROMENT)

    const facingUser = computed(() => {
        return mode.value === CameraModeType.USER
    })

    const modeOption = computed(() => {
        return mode.value == CameraModeType.USER ? facingModeUserOption : facingModeEnvironmentOption
    })


    function play() {
        try {
            videoRef.value.play();
            videoRef.value.ontimeupdate = () => {
                draw()
            }
        } catch (e) {
            alert('自动播放失败')
        }
    }


    function stopMedia(stream) {
        if (!stream) {
            return;
        }
        stream.getTracks().forEach((track) => {
            track.stop();
        });
    }

    function draw() {
        let width = canvasRef.value.width = getPureWidth(videoRef.value)
        let height = canvasRef.value.height = getPureHeight(videoRef.value)
        const context = canvasRef.value.getContext('2d')
        context.drawImage(videoRef.value, 0, 0, width, height)
        let imageData = context.getImageData(0,0,width,height)
        let qr =  jsQR(imageData.data,width,height)
        if(qr){
            console.log(qr)
        }
    }

    const switchCamera = () => {
        stopMedia(videoRef.value.srcObject);
        mode.value = mode.value == CameraModeType.ENVIROMENT ? CameraModeType.USER : CameraModeType.ENVIROMENT;
        startCamera();
    };

    function startCamera() {
        navigator.mediaDevices
            .getUserMedia(modeOption.value)
            .then(function (mediaStream) {

                videoRef.value.srcObject = mediaStream;
                play()
            })
            .catch((e) => {
                alert('摄像头启动失败')
            });
    }

    onMounted(() => {
        startCamera()
    })

    onBeforeUnmount(() => {
        stopMedia(videoRef.value.srcObject);
    });

    // 改变摄像头模式
    function changeMode() {

    }

    // 切换摄像头模式
    function toggleMode() {
        switchCamera()
    }

    return {
        mode,
        disabled,
        toggleMode,
        facingUser
    }
}