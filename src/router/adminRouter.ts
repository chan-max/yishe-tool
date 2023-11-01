import index from '@/views/admin/index.vue'
import home from '@/views/admin/view/home.vue'
import modelIndex from '@/views/admin/view/model/index/index.vue';
import modelUpload from '@/views/admin/view/model/modelUpload.vue';

import imageIndex from '@/views/admin/view/image/index/index.vue';
import imageUpload from '@/views/admin/view/image/imageUpload.vue';

import fontIndex from '@/views/admin/view/font/fontUpload.vue';
import fontUpload from '@/views/admin/view/font/fontUpload.vue';

export const adminRoutes =  [
    {
        name:'Admin',
        path: '',
        component: home,
        header:false
    },
    {
        path: 'model',
        name:'Model',
        component: modelIndex,
        header:false
    },
    {
        path: 'model/upload',
        name:'ModelUpload',
        component:modelUpload,
        header: false
    },
    {
        path: 'image',
        name:'Image',
        component: imageIndex,
        header:false
    },
    {
        path: 'image/upload',
        name:'ImageUpload',
        component:imageUpload,
        header:false
    },
    
    {
        path: 'font',
        name:'Font',
        component: fontIndex,
        header:false
    },
    {
        path: 'font/upload',
        name:'FontUpload',
        component:fontUpload,
        header:false
    },
]