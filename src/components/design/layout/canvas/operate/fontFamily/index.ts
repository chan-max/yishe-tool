
import { fetchFile } from "@/api";
import { cacheFontFamily, cacheFontFamilyLoadingMap } from "@/components/design/store";

import { message } from "ant-design-vue";

// 加载字体
export async function initFontFamilyInfo(info) {

    var file

    const { url, id, name } = info;

    // 存在缓存
    if (cacheFontFamily.value[id]) {
        return;
    }

    if (cacheFontFamilyLoadingMap.value[id]) {
        return
    }

    try {
        cacheFontFamilyLoadingMap.value[id] = true
        file = await fetchFile(url);
    } catch (e) {
        cacheFontFamilyLoadingMap.value[id] = false
        throw new Error('')
    }

    const fontStyle = document.createElement("style");
    const fontId = `font_${id}`;
    fontStyle.innerHTML = `
                @font-face {
                    font-family: ${fontId};
                    src: url(${URL.createObjectURL(file)}); 
                }
    `;


    document.head.appendChild(fontStyle);
    fontStyle.setAttribute("font_id", fontId);

    cacheFontFamily.value[id] = fontStyle;
    cacheFontFamilyLoadingMap.value[id] = false
}




export async function initFontFamilyInfoWithMessage(info) {

    const { url, id, name } = info;
    try {
        // 存在缓存
        if (cacheFontFamily.value[id]) {
            return;
        }

        if (cacheFontFamilyLoadingMap.value[id]) {
            return
        }

        message.loading({
            content: `正在加载字体${name}`,
            key: "loadfont",
            duration: 0,
        });
        await initFontFamilyInfo(info)
    } catch (e) {
        return message.error({
            content: `字体${name}加载失败`,
            key: "loadfont",
        })
    }
    message.success({
        content: `字体加载成功`,
        key: "loadfont",
    });
}