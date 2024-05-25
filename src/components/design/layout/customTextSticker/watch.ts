import { watch ,ref} from "vue";
import { currentController, operatingTextStickerOptions, showDecalControl } from "../../store";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { getFontById } from "@/api";
import { useDebounceFn } from "@vueuse/core";
import { base64ToFile } from "@/common/transform/base64ToFile";

/*

*/
export const canvasBackgroundEl = ref();
export const canvasTextEl = ref();

// 当前贴纸的编码
export const base64 = ref("");

function setFontSize(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.fontSize = operatingTextStickerOptions.value.fontSize + "px"
}

watch(() => 
     operatingTextStickerOptions.value.fontSize
,() => {
    setFontSize()
    initDraggableTextSticker()
})

function setFontWeight(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.fontWeight = operatingTextStickerOptions.value.fontWeight
}

watch(() => operatingTextStickerOptions.value.fontWeight,() => {
    setFontWeight()
    initDraggableTextSticker()
})

function setFontColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value && (canvasTextEl.value.style.color = operatingTextStickerOptions.value.fontColor);
}

watch(() => operatingTextStickerOptions.value.fontColor,() => {
    setFontColor()
    initDraggableTextSticker()
})

function setLineHeight(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.lineHeight = operatingTextStickerOptions.value.lineHeight;
}

watch(() => operatingTextStickerOptions.value.lineHeight,() => {
    setLineHeight()
    initDraggableTextSticker()
})

function setItalic(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.fontStyle = operatingTextStickerOptions.value.italic ? "italic" : "";
}

watch(() => operatingTextStickerOptions.value.italic,useDebounceFn(() => {
    setItalic()
    initDraggableTextSticker()
}))

function setLetterSpacing(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.letterSpacing = operatingTextStickerOptions.value.letterSpacing + "em";
}

watch(() => operatingTextStickerOptions.value.letterSpacing,() => {
    setLetterSpacing()
    initDraggableTextSticker()
})

function setBackgroundColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.backgroundColor = operatingTextStickerOptions.value.backgroundColor;
}

watch(() => operatingTextStickerOptions.value.backgroundColor,() => {
    setBackgroundColor()
    initDraggableTextSticker()
})

function setGradientBackgroundColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.background = operatingTextStickerOptions.value.gradientBackgroundColor;
}

watch(() => operatingTextStickerOptions.value.gradientBackgroundColor,() => {
    setGradientBackgroundColor()
    initDraggableTextSticker()
})


/* 根据文字内容更新可拖拽元素 */ 
watch(() => operatingTextStickerOptions.value.content ,async () => {
    await initDraggableTextSticker()
})

/*
    关于字体
*/

// 生成操作表单用于展示的字体信息
export const getPreviewFontFamily = () => {

}

// 用于记录已经加载的字体
const fontFamilyCache = {}

async function setFontFamliy(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    // 如果有字体信息则不需要再去请求
    let fontFamilyInfo:any = operatingTextStickerOptions.value.fontFamilyInfo
    
    if(!fontFamilyInfo){
        return
    }

    let { name, thumbnail ,url,  id } = fontFamilyInfo;

    url = 'http://' + url

    if(!fontFamilyCache[id]){
          const fontStyle = document.createElement("style");
          const fontId = `font_${id}`
          fontStyle.innerHTML = `
                @font-face {
                    font-family: ${fontId};
                    src: url(${url}); 
                }
              `;
        
          document.head.appendChild(fontStyle);
          fontStyle.setAttribute('font_id',fontId)
          fontFamilyCache[id] = fontStyle;
    }
    canvasTextEl.value.style.fontFamily = `font_${id}` 
}

watch(() => operatingTextStickerOptions.value.fontFamilyInfo,async () => {
    setFontFamliy()
    initDraggableTextSticker()
})

function setBorderWidth(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderWidth = operatingTextStickerOptions.value.borderWidth + 'em';
}

watch(() => operatingTextStickerOptions.value.borderWidth,async () => {
    setBorderWidth()
    initDraggableTextSticker()
})


function setBorderColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderColor = operatingTextStickerOptions.value.borderColor;
}

watch(() => operatingTextStickerOptions.value.borderColor,async () => {
    setBorderColor()
    initDraggableTextSticker()
})



function setBorderStyle(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderStyle = operatingTextStickerOptions.value.borderStyle;
}


watch(() => operatingTextStickerOptions.value.borderStyle,async () => {
    setBorderStyle()
    initDraggableTextSticker()
})


// 创建可拖拽的文字贴纸
export async function initDraggableTextSticker(){

    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }

  base64.value = await toPng(canvasBackgroundEl.value);
  initDraggableElement(
    canvasBackgroundEl.value,
    async (img) => {
      await currentController.value.stickToMousePosition({
        base64: base64.value,
        local: true,
        type: "text",
        img: img,
      });
    //   showDecalControl.value = true;
    },
    base64.value
  );
}

export async function exportTextStickerPng(){
    const b6 =  await toPng(canvasBackgroundEl.value);
    let file = base64ToFile(b6)
    let a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
}

export async function exportTextStickerSvg(){
    const b6 = await toSvg(canvasBackgroundEl.value);
    let file = base64ToFile(b6,new Date().getTime() + '.svg','image/svg')
    let a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
}

export function forceUpdateTextSticker(){
    setFontSize()
    setBackgroundColor()
    setFontColor()
    setFontWeight()
    setLetterSpacing()
    setLetterSpacing()
    setItalic()
    setBorderColor()
    setBorderWidth()
    setBorderStyle()
    initDraggableTextSticker()
    setFontFamliy()
}   