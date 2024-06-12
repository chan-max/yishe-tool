import { watch ,ref} from "vue";
import { currentController, operatingTextStickerOptions, showDecalControl } from "../../store";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { getFontById } from "@/api";
import { useDebounceFn,watchDebounced } from "@vueuse/core";
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
    canvasTextEl.value.style.fontSize = operatingTextStickerOptions.fontSize + "px"
}


watch(operatingTextStickerOptions,(key,value,e) => {
})

watch(() => 
     operatingTextStickerOptions.fontSize
,() => {
    setFontSize()
    initDraggableTextSticker()
})

function setFontWeight(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.fontWeight = operatingTextStickerOptions.fontWeight
}

watch(() => operatingTextStickerOptions.fontWeight,() => {
    setFontWeight()
    initDraggableTextSticker()
})

function setFontColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value && (canvasTextEl.value.style.color = operatingTextStickerOptions.fontColor);
}

watch(() => operatingTextStickerOptions.fontColor,() => {
    setFontColor()
    initDraggableTextSticker()
})

function setLineHeight(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.lineHeight = operatingTextStickerOptions.lineHeight;
}

watch(() => operatingTextStickerOptions.lineHeight,() => {
    setLineHeight()
    initDraggableTextSticker()
})

function setItalic(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.fontStyle = operatingTextStickerOptions.italic ? "italic" : "";
}

watch(() => operatingTextStickerOptions.italic,() => {
    setItalic()
    initDraggableTextSticker()
})

function setLetterSpacing(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasTextEl.value.style.letterSpacing = operatingTextStickerOptions.letterSpacing + "em";
}

watch(() => operatingTextStickerOptions.letterSpacing,() => {
    setLetterSpacing()
    initDraggableTextSticker()
})

function setBackgroundColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.backgroundColor = operatingTextStickerOptions.backgroundColor;
}

watch(() => operatingTextStickerOptions.backgroundColor,() => {
    setBackgroundColor()
    initDraggableTextSticker()
})

function setGradientBackgroundColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.background = operatingTextStickerOptions.gradientBackgroundColor;
}

watch(() => operatingTextStickerOptions.gradientBackgroundColor,() => {
    setGradientBackgroundColor()
    initDraggableTextSticker()
})


/* 根据文字内容更新可拖拽元素 */ 
watch(() => operatingTextStickerOptions.content ,async () => {
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
    let fontFamilyInfo:any = operatingTextStickerOptions.fontFamilyInfo
    
    if(!fontFamilyInfo){
        return
    }

    let { name, thumbnail ,url,  id } = fontFamilyInfo;

    url = 'https://' + url

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

watch(() => operatingTextStickerOptions.fontFamilyInfo,async () => {
    setFontFamliy()
    initDraggableTextSticker()
})

function setBorderWidth(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderWidth = operatingTextStickerOptions.borderWidth + 'em';
}

watch(() => operatingTextStickerOptions.borderWidth,useDebounceFn(() => {
    setBorderWidth()
    initDraggableTextSticker()
},33))

function setBorderColor(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderColor = operatingTextStickerOptions.borderColor;
}

watch(() => operatingTextStickerOptions.borderColor,async () => {
    setBorderColor()
    initDraggableTextSticker()
})


function setBorderStyle(){
    if(!canvasTextEl.value || !canvasBackgroundEl.value){
        return
    }
    canvasBackgroundEl.value.style.borderStyle = operatingTextStickerOptions.borderStyle;
}


watch(() => operatingTextStickerOptions.borderStyle,async () => {
    setBorderStyle()
    initDraggableTextSticker()
})


// 创建可拖拽的文字贴纸
export async function _initDraggableTextSticker(){

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
        src:img.src,
        meta:{
        }
      });
    //   showDecalControl.value = true;
    },
    base64.value
  );
}

const  initDraggableTextSticker = useDebounceFn(_initDraggableTextSticker,200)

export async function exportTextStickerPng(){
    const b6 =  await toPng(canvasBackgroundEl.value);

    let file = base64ToFile(b6)
    let a = document.createElement('a')
    a.href = URL.createObjectURL(file)
    a.download = file.name
    a.click()
}

export async function exportTextStickerSvg(){
    const b6 =  await toSvg(canvasBackgroundEl.value);
    console.log(b6)
}


export async function exportTextStickerFile(){
    const b6 =  await toPng(canvasBackgroundEl.value);
    return base64ToFile(b6)
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
    setFontFamliy()
    initDraggableTextSticker()
}   