<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item name="basic" title="基础">
      <operateItemSize
        label="尺寸"
        v-model:width="currentOperatingCanvasChild.width"
        v-model:height="currentOperatingCanvasChild.height"
      ></operateItemSize>

      <operate-form-item style="align-items: start">
        <template #name>词语列表</template>
        <template #content>
          <el-input
            v-model="wordListText"
            type="textarea"
            size="small"
            :autosize="{ minRows: 5, maxRows: 12 }"
            placeholder="每行一个：文字,权重"
            @change="applyWordListText"
            @blur="applyWordListText"
          ></el-input>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="presentation" title="表现">
      <operateItemFontFamily
        v-model="wordcloud2.fontFamilyInfo"
      ></operateItemFontFamily>

      <operate-form-item>
        <template #name>备用字体</template>
        <template #content>
          <el-input
            v-model="wordcloud2.fontFamily"
            size="small"
            placeholder="sans-serif"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字重</template>
        <template #content>
          <el-input
            v-model="wordcloud2.fontWeight"
            size="small"
            placeholder="normal / bold / 600"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>颜色模式</template>
        <template #content>
          <el-select v-model="wordcloud2.colorMode" size="small">
            <el-option label="固定颜色" value="fixed"></el-option>
            <el-option label="调色板" value="palette"></el-option>
            <el-option label="随机深色" value="random-dark"></el-option>
            <el-option label="随机浅色" value="random-light"></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operateItemColor
        v-if="wordcloud2.colorMode === 'fixed'"
        label="文字颜色"
        v-model="fixedColor"
      ></operateItemColor>

      <operate-form-item
        v-if="wordcloud2.colorMode === 'palette'"
        style="align-items: start"
      >
        <template #name>调色板</template>
        <template #content>
          <el-input
            v-model="paletteText"
            type="textarea"
            size="small"
            :autosize="{ minRows: 2, maxRows: 6 }"
            placeholder="#111111, #ff4d6d, #2ec4b6"
            @change="applyPaletteText"
            @blur="applyPaletteText"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>背景色</template>
        <template #content>
          <el-input
            v-model="wordcloud2.backgroundColor"
            size="small"
            placeholder="rgba(0,0,0,0)"
          ></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>最小绘制阈值</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.minSize"
            size="small"
            :min="0"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>字号倍率</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.weightFactor"
            size="small"
            :min="0"
            :step="0.1"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>清空画布</template>
        <template #content>
          <el-switch v-model="wordcloud2.clearCanvas"></el-switch>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="dimension" title="布局">
      <operate-form-item>
        <template #name>网格尺寸</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.gridSize"
            size="small"
            :min="1"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>中心点 X</template>
        <template #content>
          <el-input-number
            v-model="originX"
            size="small"
            :min="0"
            placeholder="自动"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>中心点 Y</template>
        <template #content>
          <el-input-number
            v-model="originY"
            size="small"
            :min="0"
            placeholder="自动"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>允许超出</template>
        <template #content>
          <el-switch v-model="wordcloud2.drawOutOfBound"></el-switch>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>自动缩小</template>
        <template #content>
          <el-switch v-model="wordcloud2.shrinkToFit"></el-switch>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="mask" title="遮罩调试">
      <operate-form-item>
        <template #name>绘制遮罩</template>
        <template #content>
          <el-switch v-model="wordcloud2.drawMask"></el-switch>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>遮罩颜色</template>
        <template #content>
          <el-input v-model="wordcloud2.maskColor" size="small"></el-input>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>遮罩间隔</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.maskGapWidth"
            size="small"
            :min="0"
            :step="0.1"
          ></el-input-number>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="timing" title="性能">
      <operate-form-item>
        <template #name>绘制等待</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.wait"
            size="small"
            :min="0"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>中止阈值</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.abortThreshold"
            size="small"
            :min="0"
          ></el-input-number>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="rotation" title="旋转">
      <operate-form-item>
        <template #name>旋转概率</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.rotateRatio"
            size="small"
            :min="0"
            :max="1"
            :step="0.05"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>最小角度</template>
        <template #content>
          <el-input-number
            v-model="minRotationDeg"
            size="small"
            :step="15"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>最大角度</template>
        <template #content>
          <el-input-number
            v-model="maxRotationDeg"
            size="small"
            :step="15"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>角度步数</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.rotationSteps"
            size="small"
            :min="0"
            :step="1"
          ></el-input-number>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="shape" title="形状">
      <operate-form-item>
        <template #name>形状</template>
        <template #content>
          <el-select v-model="wordcloud2.shape" size="small">
            <el-option
              v-for="shape in shapeOptions"
              :key="shape"
              :label="shape"
              :value="shape"
            ></el-option>
          </el-select>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>扁平度</template>
        <template #content>
          <el-input-number
            v-model="wordcloud2.ellipticity"
            size="small"
            :min="0.1"
            :step="0.1"
          ></el-input-number>
        </template>
      </operate-form-item>

      <operate-form-item>
        <template #name>随机顺序</template>
        <template #content>
          <el-switch v-model="wordcloud2.shuffle"></el-switch>
        </template>
      </operate-form-item>
    </el-collapse-item>

    <el-collapse-item name="common" title="通用属性">
      <operateItemCommonGroup
        v-model="currentOperatingCanvasChild"
      ></operateItemCommonGroup>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import operateItemSize from "@/components/design/layout/canvas/operate/size/relativeSize.vue";
import operateItemColor from "@/components/design/layout/canvas/operate/color/index.vue";
import operateItemFontFamily from "@/components/design/layout/canvas/operate/fontFamily/fontFamily.vue";
import operateItemCommonGroup from "@/components/design/layout/canvas/operate/commonGroup.vue";
import { currentOperatingCanvasChild } from "../index.tsx";
import { createDefaultWordCloud2EngineOptions } from "../children/wordCloud/index.tsx";

const activeNames = ref([
  "basic",
  "presentation",
  "dimension",
  "rotation",
  "shape",
  "common",
]);
const shapeOptions = [
  "circle",
  "cardioid",
  "diamond",
  "square",
  "triangle-forward",
  "triangle",
  "pentagon",
  "star",
];
const wordListText = ref("");
const paletteText = ref("");

const wordcloud2 = computed(() => {
  const child = currentOperatingCanvasChild.value;
  if (!child.wordCloud) {
    child.wordCloud = {
      version: 1,
      engine: "wordcloud2",
      engines: {},
    };
  }
  if (!child.wordCloud.engines) {
    child.wordCloud.engines = {};
  }
  if (!child.wordCloud.engines.wordcloud2) {
    child.wordCloud.engines.wordcloud2 = createDefaultWordCloud2EngineOptions();
  }
  return child.wordCloud.engines.wordcloud2;
});

const fixedColor = computed({
  get() {
    return {
      type: "pure",
      color: wordcloud2.value.color || "#111111",
    };
  },
  set(value: any) {
    wordcloud2.value.color = value?.color || "#111111";
  },
});

const originX = computed({
  get() {
    return Array.isArray(wordcloud2.value.origin)
      ? wordcloud2.value.origin[0]
      : undefined;
  },
  set(value: number | undefined) {
    setOrigin(0, value);
  },
});

const originY = computed({
  get() {
    return Array.isArray(wordcloud2.value.origin)
      ? wordcloud2.value.origin[1]
      : undefined;
  },
  set(value: number | undefined) {
    setOrigin(1, value);
  },
});

const minRotationDeg = computed({
  get() {
    return radToDeg(wordcloud2.value.minRotation);
  },
  set(value: number) {
    wordcloud2.value.minRotation = degToRad(value);
  },
});

const maxRotationDeg = computed({
  get() {
    return radToDeg(wordcloud2.value.maxRotation);
  },
  set(value: number) {
    wordcloud2.value.maxRotation = degToRad(value);
  },
});

function setOrigin(index: number, value: number | undefined) {
  if (value == null || Number.isNaN(Number(value))) {
    wordcloud2.value.origin = null;
    return;
  }

  const origin = Array.isArray(wordcloud2.value.origin)
    ? [...wordcloud2.value.origin]
    : [0, 0];
  origin[index] = Number(value);
  wordcloud2.value.origin = origin;
}

function syncWordListText() {
  wordListText.value = (wordcloud2.value.list || [])
    .map((item: any[]) => `${item[0] ?? ""},${item[1] ?? 0}`)
    .join("\n");
}

function applyWordListText() {
  const list = wordListText.value
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [text, weight = "20", ...extra] = line
        .split(",")
        .map((item) => item.trim());
      return [text, Number(weight) || 0, ...extra].filter(
        (item) => item !== "",
      );
    })
    .filter((item) => item[0] && Number(item[1]) > 0);

  wordcloud2.value.list = list;
}

function syncPaletteText() {
  paletteText.value = (wordcloud2.value.colors || []).join(", ");
}

function applyPaletteText() {
  wordcloud2.value.colors = paletteText.value
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function radToDeg(value: number) {
  return Math.round(((Number(value) || 0) * 180) / Math.PI);
}

function degToRad(value: number) {
  return ((Number(value) || 0) * Math.PI) / 180;
}

watch(
  wordcloud2,
  () => {
    syncWordListText();
    syncPaletteText();
  },
  { immediate: true },
);
</script>
