/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2024-01-04 21:44:55
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2024-01-04 21:49:34
 * @FilePath: /1s/src/modules/app/helper/dark.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by 1s, All Rights Reserved. 
 */
import { useDark, useToggle } from "@vueuse/core";

export const isDark = useDark({
    selector: "body",
    attribute: "class",
    valueDark: "dark",
    valueLight: "",
});

const toggleDark = useToggle(isDark);

export function toggle() {
    toggleDark();
}


