import {useSessionStorage } from '@vueuse/core'
import { useDark, useToggle } from "@vueuse/core";

//  滑动游览模型时是否展示移动提示
export const showMovableTip = useSessionStorage('showMovableTip',true);


export const isDark = useDark({
    selector: "body",
    attribute: "class",
    valueDark: "dark",
    valueLight: "",
});

// isDark.value = true

const _toggleDark = useToggle(isDark);

export function toggleDark() {
    _toggleDark();
}