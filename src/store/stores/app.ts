import {useSessionStorage } from '@vueuse/core'
import { useDark, useToggle } from "@vueuse/core";
import { ref } from 'vue'

//  滑动游览模型时是否展示移动提示
export const showMovableTip = useSessionStorage('showMovableTip',true);

// 是否正在执行自动化操作
export const isAutomationRunning = ref(false);

// 自动化操作描述
export const automationDescription = ref('');

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