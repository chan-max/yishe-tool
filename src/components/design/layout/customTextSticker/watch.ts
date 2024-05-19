import { watch ,ref} from "vue";
import { currentController, operatingTextStickerOptions, showDecalControl } from "../../store";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { getFontById } from "@/api";
import { useDebounceFn } from "@vueuse/core";


/*

*/
export const canvasBackgroundEl = ref();
export const canvasTextEl = ref();

function setFontSize(){
    canvasTextEl.value.style.fontSize = operatingTextStickerOptions.value.fontSize + "px"
}

watch(() => 
     operatingTextStickerOptions.value.fontSize
,() => {
    setFontSize()
    initDraggableTextSticker()
})

function setFontWeight(){
    
    canvasTextEl.value.style.fontWeight = operatingTextStickerOptions.value.fontWeight
}

watch(() => operatingTextStickerOptions.value.fontWeight,() => {
    setFontWeight()
    initDraggableTextSticker()
})

function setFontColor(){
    canvasTextEl.value.style.color = operatingTextStickerOptions.value.fontColor;
}

watch(() => operatingTextStickerOptions.value.fontColor,() => {
    setFontColor()
    initDraggableTextSticker()
})

function setLineHeight(){
    canvasTextEl.value.style.lineHeight = operatingTextStickerOptions.value.lineHeight;
}

watch(() => operatingTextStickerOptions.value.lineHeight,() => {
    setLineHeight()
    initDraggableTextSticker()
})

function setItalic(){
    canvasTextEl.value.style.fontStyle = operatingTextStickerOptions.value.italic ? "italic" : "";
}

watch(() => operatingTextStickerOptions.value.italic,useDebounceFn(() => {
    setItalic()
    initDraggableTextSticker()
}))

function setLetterSpacing(){
    canvasTextEl.value.style.letterSpacing = operatingTextStickerOptions.value.letterSpacing + "em";
}

watch(() => operatingTextStickerOptions.value.letterSpacing,() => {
    setLetterSpacing()
    initDraggableTextSticker()
})

function setBackgroundColor(){
    canvasBackgroundEl.value.style.backgroundColor = operatingTextStickerOptions.value.backgroundColor;
}

watch(() => operatingTextStickerOptions.value.backgroundColor,() => {
    setBackgroundColor()
    initDraggableTextSticker()
})

function setGradientBackgroundColor(){
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
    // 如果有字体信息则不需要再去请求
    let fontFamilyInfo:any = operatingTextStickerOptions.value.fontFamilyInfo || await getFontById(operatingTextStickerOptions.value.fontFamilyId)
    
    let { name, preview_file , id } = fontFamilyInfo;

    if(!fontFamilyCache[id]){
          const fontStyles = document.createElement("style");
          fontStyles.innerHTML = `
                @font-face {
                    font-family: font_${id};
                    src: url(${preview_file}); 
                }
              `;
          document.head.appendChild(fontStyles);
          fontFamilyCache[id] = fontStyles;
    }
    canvasTextEl.value.style.fontFamily = `font_${id}` 
}

watch(() => operatingTextStickerOptions.value.fontFamilyId,async () => {
    setFontFamliy()
    initDraggableTextSticker()
})

function setBorderWidth(){
    canvasBackgroundEl.value.style.borderWidth = operatingTextStickerOptions.value.borderWidth + 'em';
}

watch(() => operatingTextStickerOptions.value.borderWidth,async () => {
    setBorderWidth()
    initDraggableTextSticker()
})


function setBorderColor(){
    canvasBackgroundEl.value.style.borderColor = operatingTextStickerOptions.value.borderColor;
}

watch(() => operatingTextStickerOptions.value.borderColor,async () => {
    setBorderColor()
    initDraggableTextSticker()
})



function setBorderStyle(){
    canvasBackgroundEl.value.style.borderStyle = operatingTextStickerOptions.value.borderStyle;
}


watch(() => operatingTextStickerOptions.value.borderStyle,async () => {
    setBorderStyle()
    initDraggableTextSticker()
})

export const base64 = ref("");

// 创建可拖拽的文字贴纸 
export async function initDraggableTextSticker(){
  base64.value = await toPng(canvasBackgroundEl.value);
  initDraggableElement(
    canvasBackgroundEl.value,
    (img) => {
      currentController.value.stickToMousePosition({
        base64: base64.value,
        local: true,
        type: "text",
        img: img,
      });
      showDecalControl.value = true;
    },
    base64.value
  );
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
}   