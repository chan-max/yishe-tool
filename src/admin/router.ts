
import index from './view/index.vue'


import modelIndex from './view/model/index/index.vue';
import modelUpload from './view/model/modelUpload.vue';

import imageIndex from './view/image/index/index.vue';
import imageUpload from './view/image/imageUpload.vue';

import fontIndex from './view/font/index.vue';
import fontUpload from './view/font/fontUpload.vue';



export const adminRoutes =  [
    {
        name:'Admin',
        path: '',
        component: index,
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