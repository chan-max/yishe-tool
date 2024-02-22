import { watch ,ref} from "vue";
import { currentController, operatingTextStickerOptions, showDecalControl } from "../../store";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import { initDraggableElement } from "../../utils/draggable";
import { getFontById } from "@/api";

export const canvasBackgroundEl = ref();
export const canvasTextEl = ref();

function setFontSize(){
    canvasTextEl.value.style.fontSize = operatingTextStickerOptions.fontSize + "px"
}

watch(() => operatingTextStickerOptions.fontSize,() => {
    setFontSize()
    initDraggableTextSticker()
})

function setFontWeight(){
    
    canvasTextEl.value.style.fontWeight = operatingTextStickerOptions.fontWeight
}

watch(() => operatingTextStickerOptions.fontWeight,() => {
    setFontWeight()
    initDraggableTextSticker()
})

function setFontColor(){
    
    canvasTextEl.value.style.color = operatingTextStickerOptions.fontColor;
}

watch(() => operatingTextStickerOptions.fontColor,() => {
    setFontColor()
    initDraggableTextSticker()
})

function setLineHeight(){
    
    canvasTextEl.value.style.lineHeight = operatingTextStickerOptions.lineHeight;
}

watch(() => operatingTextStickerOptions.lineHeight,() => {
    setLineHeight()
    initDraggableTextSticker()
})

function setItalic(){
    
    canvasTextEl.value.style.fontStyle = operatingTextStickerOptions.italic ? "italic" : "";
}

watch(() => operatingTextStickerOptions.italic,() => {
    setItalic()
    initDraggableTextSticker()
})

function setLetterSpacing(){
    
    canvasTextEl.value.style.letterSpacing = operatingTextStickerOptions.letterSpacing + "em";
}

watch(() => operatingTextStickerOptions.letterSpacing,() => {
    setLetterSpacing()
    initDraggableTextSticker()
})

function setBackgroundColor(){
    
    canvasBackgroundEl.value.style.background = operatingTextStickerOptions.backgroundColor;
}

watch(() => operatingTextStickerOptions.backgroundColor,() => {
    setBackgroundColor()
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
    // 如果有字体信息则不需要再去请求
    let fontFamilyInfo:any = operatingTextStickerOptions.fontFamilyInfo || await getFontById(operatingTextStickerOptions.fontFamilyId)
    
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

watch(() => operatingTextStickerOptions.fontFamilyId,async () => {
    setFontFamliy()
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
    initDraggableTextSticker()
}   