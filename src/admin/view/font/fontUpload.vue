<template>
    <div class="upload-font">
        <input  ref="fileEl" @change="fileChange" type="file" accept=".ttf, .otf, .woff, .woff2"
            placeholder="请选择字体文件">
        <input v-model="fileName" placeholder="字体名称">
        <textarea v-model="filedescription" placeholder="字体介绍"></textarea>
        <button @click="upload"> 上传字体 </button>
        <input v-model="previewText" placeholder="例子文本">
        <br>
        <div ref="previewEl" style="padding:10px;display:inline-block;border:1px solid gray;font-size:30px;margin-top:50px;">
            {{ previewText }}
        </div>
    </div>
</template>
<script setup>
import { ref, shallowRef, watchEffect } from 'vue';
import { uploadFont } from '@/api/index';


const fileName = ref('')
const filedescription = ref('')
const file = shallowRef('')

const fileEl = ref()

const previewText = ref('1s.design')
const previewEl = ref()

watchEffect(() => {
    const f = file.value
    debugger
})


function fileChange() {
    const f = fileEl.value.files[0];
    file.value = f
    fileName.value = f.name
}

function upload() {
    const formData = new FormData();
    formData.append('name', fileName.value);
    formData.append('description', filedescription.value);
    formData.append('file', file.value);
    uploadFont(formData)
}

</script>
<style>
.upload-font{
}
</style>