

import s1Empty from './empty/index.vue'
import s1Image from './image.vue'
import s1Scrollbar from "@/components/scrollbar/index.vue";
import { loadingBottom } from "@/components/loading/index.tsx";
import svgIcon from './icon/index.vue'
import s1Table from './s1Table/index.vue';
import s1Pagination from './s1Table/pagination.vue';
import gltfViewer from './model/gltfViewer/index.vue'
import tagsInput from "@/components/design/components/tagsInput/tagsInput.vue";
import baseGltfViewer from "@/components/model/baseGltfViewer/index.vue";
import imageListUploader from './imageListUploader/index.vue'


export const s1Plugin = {
    install(app) {
        app.component('s1Empty', s1Empty);
        app.component('s1Image', s1Image);
        app.component('s1Img', s1Image);
        app.component('s1Scrollbar', s1Scrollbar);
        app.component('s1LoadingBottom', loadingBottom);
        app.component('s1Icon', svgIcon)
        app.component('s1GltViewer', gltfViewer)
        app.component('s1Table', s1Table);
        app.component('s1Pagination', s1Pagination);
        app.component('s1ImageListUploader', imageListUploader)
        app.component('s1TagsInput', tagsInput)
        app.component('s1BaseGltfViewer', baseGltfViewer)
    }
}