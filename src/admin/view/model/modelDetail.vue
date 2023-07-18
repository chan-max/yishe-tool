<template>
    <div class="admin-model-detail">
        模型详情{{ id }}
    </div>
</template>
<script setup lang="ts">

    const props = defineProps({
        id: {
            type: String,
            required: true
        }
    })

    

</script>
<style>
.admin-model-detail{
    width: 100%;
    height: 100%;
}
</style>
