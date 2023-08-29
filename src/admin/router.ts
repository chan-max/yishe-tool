
import index from './view/index.vue'


import modelIndex from './view/model/index/index.vue';
import modelUpload from './view/model/modelUpload.vue';
import modelDetail from './view/model/modelDetail.vue';

import imageIndex from './view/image/index/index.vue';
import imageUpload from './view/image/imageUpload.vue';
import imageDetail from './view/image/imageDetail.vue';


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
        path: 'model/:id',
        name:'ModelDetail',
        component:modelDetail,
        props:true,
        header:false
    },
    {
        path: 'model/upload',
        name:'ModelUpload',
        component:modelUpload,
        header:false
    },
    {
        path: 'image',
        name:'Image',
        component: imageIndex,
        header:false
    },
    {
        path: 'image/:id',
        name:'ImageDetail',
        component:imageDetail,
        props:true,
        header:false
    },
    {
        path: 'image/upload',
        name:'ImageUpload',
        component:imageUpload,
        header:false
    },
    
]