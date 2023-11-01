<template>
    <div class="upload-font">
        <input ref="fileEl" @change="fileChange" type="file" accept=".ttf, .otf, .woff, .woff2" placeholder="请选择字体文件">
        <input v-model="fileName" placeholder="字体名称">
        <textarea v-model="filedescription" placeholder="字体介绍"></textarea>
        <button @click="upload"> 上传字体 </button>
        <input v-model="previewText" placeholder="例子文本">
        <br>
        <div ref="previewEl"
            style="display:inline-block;border:1px solid gray;font-size:50px;margin-top:50px;">
            {{ previewText }}
        </div>
    </div>
</template>
<script setup>
import { ref, shallowRef, watchEffect } from 'vue';
import { uploadFont } from '@/api/index';
import html2canvas from 'html2canvas';

const fileName = ref('')
const filedescription = ref('')
const file = shallowRef('')

const fileEl = ref()

const previewText = ref('1s.design')
const previewEl = ref()

var i = 0

watchEffect(() => {
    if (!file.value) { return }
    const reader = new FileReader();
    reader.onload = (e) => {
        const fontData = e.target.result; // 获取文件的内容

        const fontName = `font${i++}`

        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
      @font-face {
        font-family: ${fontName};
        src: url(${fontData});
      }
      #el {
        font-family: 'CustomFont';
      }
    `;

        document.head.appendChild(styleElement);
        previewEl.value.style.fontFamily = fontName;
    };
    reader.readAsDataURL(file.value); // 读取文件内容
})


function fileChange() {
    const f = fileEl.value.files[0];
    file.value = f
    fileName.value = f.name
    previewText.value = f.name
}

async function upload() {
    const formData = new FormData();
    formData.append('name', fileName.value);
    formData.append('description', filedescription.value);
    formData.append('file', file.value);

    const canvas = await html2canvas(previewEl.value)
    canvas.toBlob((blob) => {
        const img = new File([blob], 'image.png', { type: 'image/png' });
        formData.append('img', img)
        uploadFont(formData)
    })
}

</script>
<style>
.upload-font {

}
</style>