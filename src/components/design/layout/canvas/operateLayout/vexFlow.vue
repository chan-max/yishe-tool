<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="notes" title="音符">
      <operate-form-item>
        <template #name>谱号</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.clef" size="small">
            <el-option label="高音谱号 (Treble)" value="treble" />
            <el-option label="低音谱号 (Bass)" value="bass" />
            <el-option label="中音谱号 (Alto)" value="alto" />
            <el-option label="次中音谱号 (Tenor)" value="tenor" />
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>拍号</template>
        <template #content>
          <el-select v-model="currentOperatingCanvasChild.timeSignature" size="small">
            <el-option label="4/4" value="4/4" />
            <el-option label="3/4" value="3/4" />
            <el-option label="2/4" value="2/4" />
            <el-option label="6/8" value="6/8" />
            <el-option label="2/2" value="2/2" />
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>音符</template>
        <template #content>
          <div class="vexflow-notes-editor">
            <div
              v-for="(note, index) in currentOperatingCanvasChild.notes"
              :key="index"
              class="vexflow-notes-editor__item"
            >
              <el-input
                v-model="note.keys[0]"
                size="small"
                placeholder="c/4"
                class="vexflow-notes-editor__key"
              />
              <el-select v-model="note.duration" size="small" class="vexflow-notes-editor__duration">
                <el-option label="全音符" value="w" />
                <el-option label="二分音符" value="h" />
                <el-option label="四分音符" value="q" />
                <el-option label="八分音符" value="8" />
                <el-option label="十六分音符" value="16" />
              </el-select>
              <el-button
                size="small"
                type="danger"
                text
                @click="removeNote(index)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
            <el-button size="small" @click="addNote">添加音符</el-button>
          </div>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      />

      <operateItemBackgroundColor v-model="currentOperatingCanvasChild.backgroundColor" />
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup v-model="currentOperatingCanvasChild" />
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Delete } from "@element-plus/icons-vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemBackgroundColor from "@/components/design/layout/canvas/operate/backgroundColor.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";

const activeNames = ref(["notes", "basic", "common"]);

function addNote() {
  if (!currentOperatingCanvasChild.value.notes) {
    currentOperatingCanvasChild.value.notes = [];
  }
  currentOperatingCanvasChild.value.notes.push({
    keys: ["c/4"],
    duration: "q",
  });
}

function removeNote(index: number | string) {
  currentOperatingCanvasChild.value.notes.splice(Number(index), 1);
}
</script>

<style scoped>
.vexflow-notes-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vexflow-notes-editor__item {
  display: flex;
  gap: 4px;
  align-items: center;
}

.vexflow-notes-editor__key {
  flex: 1;
}

.vexflow-notes-editor__duration {
  width: 120px;
}
</style>
