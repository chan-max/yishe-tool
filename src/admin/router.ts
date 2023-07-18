
import index from './view/index.vue'
import modelIndex from './view/model/index.vue';

import modelUpload from './view/model/modelUpload.vue';
import modelDetail from './view/model/modelDetail.vue';

export const adminRoutes =  [
    {
        name:'Admin',
        path: '',
        component: index,
    },
    {
        path: 'model',
        name:'Model',
        component: modelIndex,
    },
    {
        path: 'model/:id',
        name:'ModelDetail',
        component:modelDetail,
        props:true
    },
    {
        path: 'model/upload',
        name:'ModelUpload',
        component:modelUpload,
    },
]