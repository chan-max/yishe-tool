

import s1Empty from './empty/index.vue'
import s1Image from './image.vue'
import s1Scrollbar from "@/components/scrollbar/index.vue";
import { loadingBottom } from "@/components/loading/index.tsx";
import svgIcon from './icon/index.vue'

export const s1Plugin = {
    install(app) {
        app.component('s1Empty', s1Empty);
        app.component('s1Image', s1Image);
        app.component('s1Img', s1Image);
        app.component('s1Scrollbar', s1Scrollbar);
        app.component('s1LoadingBottom', loadingBottom);
        app.component('s1-icon', svgIcon)
    }
}