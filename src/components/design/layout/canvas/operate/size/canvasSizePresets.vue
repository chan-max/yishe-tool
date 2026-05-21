<template>
  <operate-form-item>
    <template #icon>
      <Setting />
    </template>
    <template #name> 常用尺寸比例 </template>
    <template #content>
      <el-button
        size="small"
        @click="dialogVisible = true"
        style="width: 160px"
      >
        选择常用尺寸
      </el-button>
    </template>
  </operate-form-item>

  <el-dialog
    v-model="dialogVisible"
    title="选择常用尺寸比例"
    fullscreen
    append-to-body
    class="size-presets-dialog"
  >
    <div class="preset-container">
      <el-tabs v-model="activeTab" class="preset-tabs">
        <el-tab-pane label="常用尺寸" name="presets">
          <div class="preset-search">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索商品、用途或尺寸，例如：鼠标垫 / 杯子 / 900x400"
              clearable
              class="preset-search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div class="preset-search-meta">共 {{ matchedPresetCount }} 个结果</div>
          </div>

          <div v-if="filteredSizeGroups.length === 0" class="preset-empty">
            没有找到匹配的尺寸，试试搜索商品名称、用途或具体规格。
          </div>

          <div
            v-for="group in filteredSizeGroups"
            :key="group.label"
            class="preset-group"
          >
            <div class="group-title">{{ group.label }}</div>
            <div class="preset-items">
              <div
                v-for="item in group.options"
                :key="item.label"
                class="preset-card"
                @click="handleSelect(item)"
              >
                <div class="preview-box">
                  <div class="aspect-ratio-box" :style="getRatioStyle(item)"></div>
                </div>
                <div class="preset-info">
                  <div class="preset-label">{{ item.label }}</div>
                  <div class="preset-size">
                    {{ item.width }} x {{ item.height }}
                  </div>
                  <div class="preset-ratio">
                    比例 {{ formatDisplayRatio(item) }}
                  </div>
                  <div class="preset-desc" v-if="item.description">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="比例选择" name="ratio">
          <div class="ratio-custom-container">
            <div class="ratio-description">
              选择一个比例，然后选择或输入宽度，即可自动生成对应尺寸。
            </div>

            <div
              v-for="category in ratioCategories"
              :key="category.label"
              class="ratio-category"
            >
              <div class="category-title">
                {{ category.label }}
                <span class="category-desc">{{ category.description }}</span>
              </div>
              <div class="ratio-grid">
                <div
                  v-for="ratio in category.ratios"
                  :key="ratio.display"
                  class="ratio-card"
                  @click="openRatioDialog(ratio)"
                >
                  <div class="ratio-preview" :style="getRatioPreviewStyle(ratio)">
                    <div class="ratio-inner"></div>
                  </div>
                  <div class="ratio-info">
                    <div class="ratio-label">{{ ratio.display }}</div>
                    <div class="ratio-name">{{ ratio.name }}</div>
                    <div class="ratio-usage">{{ ratio.usage }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>

  <!-- 比例尺寸选择弹窗 -->
  <el-dialog
    v-model="ratioDialogVisible"
    :title="`设置尺寸 - ${currentRatio?.display} ${currentRatio?.name || ''}`"
    width="480px"
    append-to-body
    class="ratio-size-dialog"
  >
    <div class="ratio-dialog-content" v-if="currentRatio">
      <div class="ratio-dialog-desc">
        {{ currentRatio.description }} · {{ currentRatio.usage }}
      </div>

      <div class="ratio-dialog-section">
        <div class="section-label">选择宽度</div>
        <div class="width-quick-btns">
          <el-button
            v-for="w in quickWidths"
            :key="w"
            size="small"
            :type="customWidth === w ? 'primary' : 'default'"
            @click="customWidth = w; updateCustomHeight()"
          >
            {{ w }}
          </el-button>
        </div>
        <div class="custom-width-group">
          <span class="width-label">自定义</span>
          <el-input-number
            v-model="customWidth"
            :min="100"
            :max="20000"
            :step="10"
            :precision="0"
            controls-position="right"
            class="custom-width-input"
            @input="updateCustomHeight"
          />
          <span class="width-unit">px</span>
        </div>
      </div>

      <div class="ratio-dialog-result">
        <div class="result-display">
          <span class="result-width">{{ customWidth }}</span>
          <span class="result-x">×</span>
          <span class="result-height">{{ customHeight }}</span>
          <span class="result-unit">px</span>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="ratioDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleRatioConfirm">确认使用</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, Setting } from "@element-plus/icons-vue";
import operateFormItem from "../operateFormItem.vue";

const emit = defineEmits(["select"]);

const dialogVisible = ref(false);
const searchKeyword = ref("");
const activeTab = ref("presets");

// ==================== 比例选择相关 ====================

interface CommonSize {
  label: string;
  width: number;
  height: number;
  desc?: string;
}

interface RatioOption {
  name: string;
  width: number;
  height: number;
  display: string;
  description: string;
  usage: string;
  commonSizes: CommonSize[];
}

interface RatioCategory {
  label: string;
  icon: string;
  description: string;
  ratios: RatioOption[];
}

const ratioCategories: RatioCategory[] = [
  {
    label: "超长竖图",
    icon: "",
    description: "适合手机壳、袖标、长条标签等",
    ratios: [
      {
        name: "超窄竖图",
        width: 1,
        height: 4,
        display: "1:4",
        description: "极限竖长比例",
        usage: "袖子印花、超长标签、竖条装饰",
        commonSizes: [
          { label: "袖标", width: 800, height: 3200, desc: "2.5x10英寸" },
          { label: "长标签", width: 600, height: 2400, desc: "5x20cm" },
          { label: "竖条幅", width: 500, height: 2000, desc: "" },
        ],
      },
      {
        name: "窄竖图",
        width: 1,
        height: 3,
        display: "1:3",
        description: "竖长比例",
        usage: "手机壳全包、袖子印花、长条标签",
        commonSizes: [
          { label: "手机壳全包", width: 1050, height: 3150, desc: "兼容各机型" },
          { label: "袖标", width: 1050, height: 3150, desc: "3.5x10.5英寸" },
          { label: "竖条标签", width: 800, height: 2400, desc: "" },
        ],
      },
      {
        name: "竖长图",
        width: 1,
        height: 2.5,
        display: "1:2.5",
        description: "竖长比例",
        usage: "手机壳背板、竖版条幅",
        commonSizes: [
          { label: "手机壳", width: 1050, height: 2625, desc: "背板设计" },
          { label: "竖条幅", width: 800, height: 2000, desc: "" },
        ],
      },
      {
        name: "竖长图",
        width: 1,
        height: 2,
        display: "1:2",
        description: "经典竖长比例",
        usage: "易拉宝、X展架、竖版海报",
        commonSizes: [
          { label: "易拉宝", width: 2002, height: 4004, desc: "80x160cm" },
          { label: "X展架", width: 1875, height: 3750, desc: "60x120cm" },
          { label: "竖版海报", width: 1000, height: 2000, desc: "" },
          { label: "竖版Banner", width: 800, height: 1600, desc: "" },
        ],
      },
    ],
  },
  {
    label: "竖屏视频 / 全屏",
    icon: "",
    description: "适合手机竖屏内容、短视频、Story",
    ratios: [
      {
        name: "iPhone全面屏",
        width: 9,
        height: 19.5,
        display: "9:19.5",
        description: "iPhone X及以后机型",
        usage: "iPhone壁纸、App截图、全面屏适配",
        commonSizes: [
          { label: "iPhone壁纸", width: 1242, height: 2688, desc: "iPhone XS Max" },
          { label: "App截图", width: 1290, height: 2796, desc: "iPhone 15 Pro Max" },
          { label: "标准", width: 1080, height: 2340, desc: "" },
        ],
      },
      {
        name: "竖屏视频",
        width: 9,
        height: 16,
        display: "9:16",
        description: "竖屏全屏比例",
        usage: "抖音/快手/Reels、手机壁纸、短视频封面",
        commonSizes: [
          { label: "抖音/快手", width: 1080, height: 1920, desc: "推荐尺寸" },
          { label: "Instagram Story", width: 1080, height: 1920, desc: "" },
          { label: "TikTok", width: 1080, height: 1920, desc: "" },
          { label: "手机壁纸", width: 1440, height: 2560, desc: "2K分辨率" },
          { label: "高清壁纸", width: 2160, height: 3840, desc: "4K分辨率" },
        ],
      },
      {
        name: "竖版海报",
        width: 9,
        height: 14,
        display: "9:14",
        description: "竖版展架比例",
        usage: "竖版展架、人形立牌、竖版海报",
        commonSizes: [
          { label: "展架", width: 1620, height: 2520, desc: "54x84cm" },
          { label: "海报", width: 1285, height: 2000, desc: "" },
        ],
      },
      {
        name: "竖版海报",
        width: 9,
        height: 12,
        display: "9:12",
        description: "竖版印刷比例",
        usage: "竖版海报、传单、宣传页",
        commonSizes: [
          { label: "海报", width: 1800, height: 2400, desc: "15x20cm" },
          { label: "传单", width: 1350, height: 1800, desc: "" },
        ],
      },
      {
        name: "竖版长图",
        width: 2,
        height: 3,
        display: "2:3",
        description: "经典竖版比例",
        usage: "小红书竖图、Pinterest、杂志内页、书籍封面",
        commonSizes: [
          { label: "小红书竖图", width: 1080, height: 1620, desc: "推荐尺寸" },
          { label: "Pinterest", width: 1000, height: 1500, desc: "Pin标准" },
          { label: "杂志内页", width: 2400, height: 3600, desc: "20x30cm" },
          { label: "书籍封面", width: 1600, height: 2400, desc: "" },
          { label: "A4竖版", width: 2480, height: 3720, desc: "21x31.5cm" },
        ],
      },
    ],
  },
  {
    label: "竖版近方",
    icon: "",
    description: "适合竖版照片、社交媒体图、商品图",
    ratios: [
      {
        name: "竖版",
        width: 3,
        height: 4,
        display: "3:4",
        description: "标准竖版比例",
        usage: "小红书推荐、朋友圈、竖版照片、电商详情",
        commonSizes: [
          { label: "小红书", width: 1080, height: 1440, desc: "推荐竖图" },
          { label: "朋友圈", width: 1080, height: 1440, desc: "" },
          { label: "淘宝主图", width: 750, height: 1000, desc: "竖版主图" },
          { label: "高清照片", width: 2400, height: 3200, desc: "20x26.7cm" },
          { label: "印刷品", width: 3000, height: 4000, desc: "25x33cm" },
        ],
      },
      {
        name: "竖版近方",
        width: 4,
        height: 5,
        display: "4:5",
        description: "Instagram竖图比例",
        usage: "Instagram竖图、商品主图、社交媒体",
        commonSizes: [
          { label: "Instagram", width: 1080, height: 1350, desc: "推荐竖图" },
          { label: "商品主图", width: 800, height: 1000, desc: "电商通用" },
          { label: "高清", width: 1600, height: 2000, desc: "" },
          { label: "印刷", width: 3200, height: 4000, desc: "27x34cm" },
        ],
      },
      {
        name: "竖版近方",
        width: 5,
        height: 6,
        display: "5:6",
        description: "竖版近方比例",
        usage: "电商详情图、竖版海报",
        commonSizes: [
          { label: "详情图", width: 1000, height: 1200, desc: "" },
          { label: "海报", width: 2500, height: 3000, desc: "" },
        ],
      },
      {
        name: "竖版近方",
        width: 6,
        height: 7,
        display: "6:7",
        description: "竖版近方比例",
        usage: "竖版封面、产品展示",
        commonSizes: [
          { label: "封面", width: 1200, height: 1400, desc: "" },
          { label: "展示图", width: 1800, height: 2100, desc: "" },
        ],
      },
      {
        name: "竖版近方",
        width: 7,
        height: 8,
        display: "7:8",
        description: "竖版近方比例",
        usage: "竖版卡片、邀请函",
        commonSizes: [
          { label: "卡片", width: 1400, height: 1600, desc: "" },
          { label: "邀请函", width: 2100, height: 2400, desc: "" },
        ],
      },
      {
        name: "竖版近方",
        width: 8,
        height: 9,
        display: "8:9",
        description: "接近正方形",
        usage: "竖版广告、社交媒体图",
        commonSizes: [
          { label: "广告图", width: 1600, height: 1800, desc: "" },
          { label: "社媒图", width: 2400, height: 2700, desc: "" },
        ],
      },
    ],
  },
  {
    label: "正方形",
    icon: "",
    description: "1:1比例，适合头像、Logo、商品主图",
    ratios: [
      {
        name: "正方形",
        width: 1,
        height: 1,
        display: "1:1",
        description: "完美正方形",
        usage: "头像、Logo、淘宝/京东主图、Instagram、贴纸",
        commonSizes: [
          { label: "头像", width: 400, height: 400, desc: "通用头像" },
          { label: "Logo", width: 500, height: 500, desc: "" },
          { label: "淘宝主图", width: 800, height: 800, desc: "标准尺寸" },
          { label: "京东主图", width: 800, height: 800, desc: "" },
          { label: "Instagram", width: 1080, height: 1080, desc: "推荐尺寸" },
          { label: "高清", width: 1500, height: 1500, desc: "" },
          { label: "印刷", width: 3000, height: 3000, desc: "25x25cm" },
          { label: "大幅", width: 5000, height: 5000, desc: "42x42cm" },
        ],
      },
    ],
  },
  {
    label: "横版近方",
    icon: "",
    description: "适合横版照片、封面、Banner",
    ratios: [
      {
        name: "横版近方",
        width: 9,
        height: 8,
        display: "9:8",
        description: "横版近方比例",
        usage: "横版广告、封面图",
        commonSizes: [
          { label: "广告图", width: 1800, height: 1600, desc: "" },
          { label: "封面", width: 2700, height: 2400, desc: "" },
        ],
      },
      {
        name: "横版近方",
        width: 8,
        height: 7,
        display: "8:7",
        description: "横版近方比例",
        usage: "微信封面、横版卡片",
        commonSizes: [
          { label: "微信封面", width: 1600, height: 1400, desc: "" },
          { label: "卡片", width: 2400, height: 2100, desc: "" },
        ],
      },
      {
        name: "横版近方",
        width: 7,
        height: 6,
        display: "7:6",
        description: "横版近方比例",
        usage: "产品展示、横版海报",
        commonSizes: [
          { label: "产品图", width: 1400, height: 1200, desc: "" },
          { label: "海报", width: 2800, height: 2400, desc: "" },
        ],
      },
      {
        name: "横版近方",
        width: 6,
        height: 5,
        display: "6:5",
        description: "横版近方比例",
        usage: "横版封面、电商Banner",
        commonSizes: [
          { label: "Banner", width: 1200, height: 1000, desc: "" },
          { label: "封面", width: 1800, height: 1500, desc: "" },
          { label: "高清", width: 2400, height: 2000, desc: "" },
        ],
      },
      {
        name: "横版照片",
        width: 5,
        height: 4,
        display: "5:4",
        description: "横版照片比例",
        usage: "Etsy商品图、Facebook封面、横版照片",
        commonSizes: [
          { label: "Etsy商品图", width: 2000, height: 1600, desc: "推荐尺寸" },
          { label: "Facebook封面", width: 1640, height: 1312, desc: "" },
          { label: "照片", width: 2500, height: 2000, desc: "" },
        ],
      },
    ],
  },
  {
    label: "经典横版",
    icon: "",
    description: "适合屏幕显示、照片、演示文稿",
    ratios: [
      {
        name: "传统屏幕",
        width: 4,
        height: 3,
        display: "4:3",
        description: "传统屏幕/照片比例",
        usage: "iPad屏幕、传统照片、演示文稿、投影仪",
        commonSizes: [
          { label: "iPad", width: 2048, height: 1536, desc: "iPad Air" },
          { label: "照片", width: 1600, height: 1200, desc: "" },
          { label: "PPT", width: 1024, height: 768, desc: "标准" },
          { label: "高清", width: 2400, height: 1800, desc: "" },
          { label: "印刷", width: 3000, height: 2250, desc: "25x19cm" },
        ],
      },
      {
        name: "横版宽图",
        width: 3,
        height: 2,
        display: "3:2",
        description: "经典摄影比例",
        usage: "单反照片、印刷品、摄影作品、杂志",
        commonSizes: [
          { label: "单反照片", width: 1920, height: 1280, desc: "" },
          { label: "6寸照片", width: 1800, height: 1200, desc: "15x10cm" },
          { label: "高清", width: 3000, height: 2000, desc: "25x17cm" },
          { label: "印刷", width: 4500, height: 3000, desc: "38x25cm" },
          { label: "大幅", width: 6000, height: 4000, desc: "50x33cm" },
        ],
      },
      {
        name: "黄金比例",
        width: 1.618,
        height: 1,
        display: "1.618:1",
        description: "黄金分割比例",
        usage: "艺术构图、品牌设计、优雅排版",
        commonSizes: [
          { label: "标准", width: 1618, height: 1000, desc: "" },
          { label: "高清", width: 2427, height: 1500, desc: "" },
          { label: "印刷", width: 3236, height: 2000, desc: "" },
        ],
      },
    ],
  },
  {
    label: "宽屏 / 显示器",
    icon: "",
    description: "适合电脑屏幕、视频、壁纸",
    ratios: [
      {
        name: "MacBook屏幕",
        width: 16,
        height: 10,
        display: "16:10",
        description: "MacBook/显示器比例",
        usage: "MacBook屏幕、显示器、笔记本壁纸",
        commonSizes: [
          { label: "MacBook Air", width: 2560, height: 1600, desc: "" },
          { label: "MacBook Pro", width: 3072, height: 1920, desc: "16寸" },
          { label: "显示器", width: 1920, height: 1200, desc: "" },
          { label: "4K显示器", width: 3840, height: 2400, desc: "" },
        ],
      },
      {
        name: "高清宽屏",
        width: 16,
        height: 9,
        display: "16:9",
        description: "主流宽屏比例",
        usage: "YouTube、电脑壁纸、PPT、视频、直播",
        commonSizes: [
          { label: "720p", width: 1280, height: 720, desc: "HD" },
          { label: "1080p", width: 1920, height: 1080, desc: "Full HD" },
          { label: "2K", width: 2560, height: 1440, desc: "QHD" },
          { label: "4K", width: 3840, height: 2160, desc: "UHD" },
          { label: "YouTube封面", width: 1280, height: 720, desc: "缩略图" },
          { label: "PPT", width: 1920, height: 1080, desc: "宽屏" },
          { label: "横幅", width: 2560, height: 1440, desc: "" },
        ],
      },
      {
        name: "电影宽屏",
        width: 18,
        height: 9,
        display: "18:9",
        description: "电影/手机横屏比例",
        usage: "电影海报、宽屏视频、手机横屏",
        commonSizes: [
          { label: "手机横屏", width: 2160, height: 1080, desc: "" },
          { label: "电影海报", width: 1800, height: 900, desc: "" },
        ],
      },
      {
        name: "超宽屏",
        width: 21,
        height: 9,
        display: "21:9",
        description: "带鱼屏/电影比例",
        usage: "带鱼屏显示器、电影海报、超宽Banner",
        commonSizes: [
          { label: "带鱼屏", width: 3440, height: 1440, desc: "" },
          { label: "超宽屏", width: 2560, height: 1080, desc: "" },
          { label: "电影海报", width: 2100, height: 900, desc: "" },
          { label: "横幅", width: 4200, height: 1800, desc: "" },
        ],
      },
    ],
  },
  {
    label: "超宽横图",
    icon: "",
    description: "适合Banner、横幅、全景图",
    ratios: [
      {
        name: "超宽屏",
        width: 2,
        height: 1,
        display: "2:1",
        description: "超宽比例",
        usage: "全景图、网页Banner、全景照片、博客头图",
        commonSizes: [
          { label: "Banner", width: 1920, height: 960, desc: "" },
          { label: "全景图", width: 2000, height: 1000, desc: "" },
          { label: "博客头图", width: 1600, height: 800, desc: "" },
          { label: "高清", width: 3840, height: 1920, desc: "" },
        ],
      },
      {
        name: "公众号首图",
        width: 2.35,
        height: 1,
        display: "2.35:1",
        description: "电影宽银幕比例",
        usage: "微信公众号首图、电影宽银幕",
        commonSizes: [
          { label: "公众号首图", width: 900, height: 383, desc: "推荐尺寸" },
          { label: "高清", width: 2350, height: 1000, desc: "" },
        ],
      },
      {
        name: "超宽横幅",
        width: 3,
        height: 1,
        display: "3:1",
        description: "超宽横幅比例",
        usage: "网页通栏、户外横幅、店铺招牌、轮播图",
        commonSizes: [
          { label: "网页通栏", width: 1920, height: 640, desc: "" },
          { label: "店铺招牌", width: 1200, height: 400, desc: "" },
          { label: "横幅", width: 3000, height: 1000, desc: "" },
          { label: "户外横幅", width: 6000, height: 2000, desc: "" },
        ],
      },
      {
        name: "超宽横幅",
        width: 4,
        height: 1,
        display: "4:1",
        description: "极限横宽比例",
        usage: "超长横幅、轮播图、时间轴、网站顶部",
        commonSizes: [
          { label: "轮播图", width: 1920, height: 480, desc: "" },
          { label: "横幅", width: 2400, height: 600, desc: "" },
          { label: "超长横幅", width: 4000, height: 1000, desc: "" },
        ],
      },
    ],
  },
];

const ratioDialogVisible = ref(false);
const currentRatio = ref<RatioOption | null>(null);
const customWidth = ref(1080);
const customHeight = ref(1920);

const quickWidths = [1000, 1200, 1500, 1920, 2000, 2560, 3000, 3840, 4000, 5000, 6000, 7680, 8000, 10000];

function openRatioDialog(ratio: RatioOption) {
  currentRatio.value = ratio;
  customWidth.value = 1920;
  updateCustomHeight();
  ratioDialogVisible.value = true;
}

function selectPresetSize(size: CommonSize) {
  customWidth.value = size.width;
  customHeight.value = size.height;
}

function updateCustomHeight() {
  if (!currentRatio.value) return;
  const ratio = currentRatio.value;
  customHeight.value = Math.round((customWidth.value / ratio.width) * ratio.height);
}

function handleRatioConfirm() {
  emit("select", {
    width: customWidth.value,
    height: customHeight.value,
  });
  ratioDialogVisible.value = false;
  dialogVisible.value = false;
}

function getRatioPreviewStyle(ratio: RatioOption) {
  const aspectRatio = ratio.width / ratio.height;
  const MAX_SIZE = 48;
  let w, h;
  if (aspectRatio > 1) {
    w = MAX_SIZE;
    h = MAX_SIZE / aspectRatio;
  } else {
    h = MAX_SIZE;
    w = MAX_SIZE * aspectRatio;
  }
  return {
    width: `${w}px`,
    height: `${h}px`,
  };
}

// ==================== 常用尺寸相关 ====================

interface SizeOption {
  label: string;
  width: number;
  height: number;
  ratio?: number;
  description?: string;
}

interface SizeGroup {
  label: string;
  options: SizeOption[];
}

const sizeGroups: SizeGroup[] = [
  {
    label: "通用比例 / 屏幕",
    options: [
      { label: "电影宽屏 (21:9)", width: 2560, height: 1080 },
      { label: "高清横屏 (16:9)", width: 1920, height: 1080 },
      { label: "黄金比例横向 (1.618:1)", width: 1618, height: 1000 },
      { label: "传统屏幕 (4:3)", width: 1024, height: 768 },
      { label: "正方形 (1:1)", width: 1080, height: 1080 },
      { label: "移动端全屏 (9:16)", width: 1080, height: 1920 },
      { label: "4K超清宽屏", width: 3840, height: 2160 },
    ],
  },
  {
    label: "高清印刷 / 大幅面输出 (300 PPI)",
    options: [
      {
        label: "8K 超清横幅 (16:9)",
        width: 7680,
        height: 4320,
        description: "33.1x65.0cm 大幅高清",
      },
      {
        label: "6K 宽幅 (3:2)",
        width: 6000,
        height: 4000,
        description: "50.8x33.9cm 摄影级画质",
      },
      {
        label: "5K 横幅 (16:9)",
        width: 5120,
        height: 2880,
        description: "43.3x24.4cm",
      },
      {
        label: "大尺寸海报横幅 (3:2)",
        width: 9000,
        height: 6000,
        description: "76.2x50.8cm 展览级",
      },
      {
        label: "巨型海报横幅 (2:1)",
        width: 10000,
        height: 5000,
        description: "84.7x42.3cm 超大面幅",
      },
      {
        label: "A0 高清 (横幅)",
        width: 9933,
        height: 7022,
        description: "84.1x59.4cm 国际标准",
      },
      {
        label: "A1 高清 (横幅)",
        width: 7022,
        height: 4967,
        description: "59.4x42cm",
      },
      {
        label: "A2 高清 (横幅)",
        width: 4967,
        height: 3510,
        description: "42x29.7cm",
      },
      {
        label: "正方形超清 (1:1)",
        width: 8000,
        height: 8000,
        description: "67.7x67.7cm 大幅贴纸/海报",
      },
      {
        label: "正方形高清 (1:1)",
        width: 6000,
        height: 6000,
        description: "50.8x50.8cm",
      },
      {
        label: "正方形标准 (1:1)",
        width: 4000,
        height: 4000,
        description: "33.9x33.9cm",
      },
      {
        label: "竖版超清 (2:3)",
        width: 6000,
        height: 9000,
        description: "50.8x76.2cm",
      },
      {
        label: "竖版高清 (3:4)",
        width: 6000,
        height: 8000,
        description: "50.8x67.7cm",
      },
      {
        label: "竖版超清 (4:5)",
        width: 6400,
        height: 8000,
        description: "54.2x67.7cm",
      },
      {
        label: "竖版横幅 (9:16)",
        width: 4320,
        height: 7680,
        description: "36.6x65.0cm",
      },
    ],
  },
  {
    label: "标准纸张与印刷 (300 PPI)",
    options: [
      {
        label: "信封 (DL尺寸)",
        width: 2598,
        height: 1299,
        description: "220x110mm",
      },
      {
        label: "中国标准名片",
        width: 1063,
        height: 638,
        description: "横版名片 90x54mm",
      },
      {
        label: "欧美标准名片 (US)",
        width: 1050,
        height: 600,
        description: "3.5×2英寸",
      },
      {
        label: "日本/国际名片",
        width: 1004,
        height: 650,
        description: "信用卡尺寸 85x55mm",
      },
      {
        label: "US Letter (北美常用)",
        width: 2550,
        height: 3300,
        description: "8.5x11英寸 信纸",
      },
      {
        label: "US Legal (北美常用)",
        width: 2550,
        height: 4200,
        description: "8.5x14英寸 法律",
      },
      {
        label: "US Tabloid (北美常用)",
        width: 3300,
        height: 5100,
        description: "11x17英寸 报纸",
      },
      {
        label: "竖版名片 (中国)",
        width: 638,
        height: 1063,
        description: "54x90mm",
      },
      {
        label: "A6 (国际通版)",
        width: 1240,
        height: 1748,
        description: "明信片/口袋本 10.5x14.8cm",
      },
      {
        label: "贺卡/邀请函 (对折)",
        width: 1500,
        height: 2100,
        description: "5x7英寸",
      },
      {
        label: "A5 (国际通版)",
        width: 1748,
        height: 2480,
        description: "小折页/手写本 14.8x21cm",
      },
      {
        label: "A4 (国际通版)",
        width: 2480,
        height: 3508,
        description: "传单/文档标准 21x29.7cm",
      },
      {
        label: "A3 (国际通版)",
        width: 3508,
        height: 4961,
        description: "小图海报/画册 29.7x42cm",
      },
      {
        label: "A2 (国际通版)",
        width: 4200,
        height: 5940,
        description: "中型海报/挂历 42x59.4cm",
      },
      {
        label: "A1 (国际通版)",
        width: 5940,
        height: 8410,
        description: "大型海报 59.4x84.1cm",
      },
      {
        label: "A0 (国际通版)",
        width: 8410,
        height: 11890,
        description: "超大海报/展板 84.1x118.9cm",
      },
    ],
  },
  {
    label: "国内电商设计",
    options: [
      {
        label: "PC端通栏海报",
        width: 1920,
        height: 700,
        description: "网页宽版店铺海报",
      },
      {
        label: "淘宝/天猫主图 (1:1)",
        width: 800,
        height: 800,
        description: "商品方图主图",
      },
      {
        label: "京东主图 (1:1)",
        width: 800,
        height: 800,
        description: "京东常标准主图",
      },
      {
        label: "1688主图 (1:1)",
        width: 750,
        height: 750,
        description: "阿里巴巴国内主图",
      },
      {
        label: "拼多多主图 (1:1)",
        width: 800,
        height: 800,
        description: "建议正方形高清",
      },
      {
        label: "淘宝主图/长图 (3:4)",
        width: 750,
        height: 1000,
        description: "高点击率长图",
      },
      {
        label: "京东详情页",
        width: 750,
        height: 1000,
        description: "京东移动端设计区",
      },
      {
        label: "淘宝无线端主图 (2:3)",
        width: 800,
        height: 1200,
        description: "女装等长款展示",
      },
      {
        label: "拼多多轮播图 (3:4)",
        width: 1080,
        height: 1440,
        description: "拼多多竖版轮播",
      },
      {
        label: "淘宝/天猫详情页",
        width: 750,
        height: 1500,
        description: "无线端标准详宽",
      },
    ],
  },
  {
    label: "跨境电商设计",
    options: [
      {
        label: "Etsy店铺横幅",
        width: 3360,
        height: 840,
        description: "大尺寸横幅",
      },
      {
        label: "Etsy商品图 (5:4)",
        width: 2000,
        height: 1600,
        description: "Etsy首图推荐比例",
      },
      {
        label: "A+ Content (主横幅)",
        width: 970,
        height: 600,
        description: "亚马逊A+页面模块",
      },
      {
        label: "eBay主图",
        width: 1600,
        height: 1600,
        description: "eBay高质量正方图",
      },
      {
        label: "Amazon主图 (推荐)",
        width: 2000,
        height: 2000,
        description: "支持高清放大(Zoom)",
      },
      {
        label: "Etsy商品图 (方)",
        width: 2000,
        height: 2000,
        description: "商品次图/备选",
      },
      {
        label: "Amazon主图 (最低)",
        width: 1000,
        height: 1000,
        description: "亚马逊基础要求",
      },
      {
        label: "速卖通主图 (AliExpress)",
        width: 1000,
        height: 1000,
        description: "1:1 正方形",
      },
      {
        label: "Shopee主图 (虾皮)",
        width: 800,
        height: 800,
        description: "东南亚电商",
      },
      {
        label: "独立站通用 (Shopify)",
        width: 1080,
        height: 1080,
        description: "自建站高质量适配",
      },
    ],
  },
  {
    label: "广告与户外展板",
    options: [
      {
        label: "横幅/条幅 (3米)",
        width: 5000,
        height: 1166,
        description: "3x0.7m (需下调DPI导出)",
      },
      {
        label: "海报横幅 (3:2)",
        width: 9000,
        height: 6000,
        description: "76x51cm 展览级300PPI",
      },
      {
        label: "超宽横幅 (21:9)",
        width: 10500,
        height: 4500,
        description: "89x38cm 宽幅展示",
      },
      {
        label: "桌面台卡 (A5)",
        width: 1748,
        height: 2480,
        description: "收款/提示牌",
      },
      {
        label: "X展架 (常规)",
        width: 1875,
        height: 5000,
        description: "60x160cm",
      },
      {
        label: "易拉宝 (国内常用)",
        width: 2002,
        height: 5000,
        description: "80x200cm (推荐下调DPI)",
      },
    ],
  },
  {
    label: "定制周边: 服饰箱包 (300 PPI)",
    options: [
      {
        label: "鸭舌帽/棒球帽 (前幅)",
        width: 1500,
        height: 600,
        description: "贴布/刺绣面 5x2英寸",
      },
      {
        label: "左胸小Logo",
        width: 1200,
        height: 1200,
        description: "4x4英寸 刺绣/小标",
      },
      {
        label: "卫衣/套头衫正面",
        width: 4200,
        height: 4200,
        description: "14x14英寸方图",
      },
      {
        label: "T恤印花区 (常规前胸)",
        width: 3543,
        height: 4724,
        description: "约12x16英寸 (300x400mm)",
      },
      {
        label: "环保袋/托特包 (全图)",
        width: 4134,
        height: 4724,
        description: "单肩包约35x40cm",
      },
      {
        label: "T恤印花区 (超大满印)",
        width: 4000,
        height: 5000,
        description: "16x20英寸",
      },
      {
        label: "袖子印花",
        width: 1050,
        height: 4500,
        description: "3.5x15英寸 侧面袖标",
      },
      {
        label: "紧身裤/瑜伽裤 (满印)",
        width: 3750,
        height: 5000,
        description: "裤腿大尺寸满版包裹",
      },
    ],
  },
  {
    label: "定制周边: 饮具杯具 (300 PPI)",
    options: [
      {
        label: "11oz 马克杯 (全包围)",
        width: 2700,
        height: 1050,
        description: "9x3.5英寸",
      },
      {
        label: "15oz 马克杯 (全包围)",
        width: 2700,
        height: 1140,
        description: "9x3.8英寸",
      },
      {
        label: "11oz 马克杯 (常规印花)",
        width: 2362,
        height: 1122,
        description: "200x95mm 单侧/双侧",
      },
      {
        label: "运动水壶",
        width: 2550,
        height: 1650,
        description: "8.5x5.5英寸",
      },
      {
        label: "20oz Skinny随行保温杯",
        width: 2790,
        height: 2460,
        description: "9.3x8.2英寸",
      },
      {
        label: "30oz Skinny随行保温杯",
        width: 3060,
        height: 2850,
        description: "10.2x9.5英寸",
      },
    ],
  },
  {
    label: "定制周边: 家居桌搭与3C",
    options: [
      {
        label: "电竞桌垫 (超宽)",
        width: 5000,
        height: 2292,
        description: "1200x550mm 展示/直播桌垫",
      },
      {
        label: "桌垫鼠标垫 (700x300)",
        width: 5000,
        height: 2143,
        description: "键盘+鼠标一体桌垫",
      },
      {
        label: "电竞鼠标垫 (超大 XL)",
        width: 5000,
        height: 2224,
        description: "900x400mm 满印",
      },
      {
        label: "电竞鼠标垫 (加长 L)",
        width: 5000,
        height: 1875,
        description: "800x300mm 满印",
      },
      {
        label: "电竞桌垫 (XXL)",
        width: 5000,
        height: 2500,
        description: "1000x500mm 超大桌面垫",
      },
      {
        label: "挂毯/背景布 (大)",
        width: 5000,
        height: 3750,
        description: "80x60英寸 150ppi",
      },
      {
        label: "挂毯/背景布 (中)",
        width: 5000,
        height: 4167,
        description: "60x50英寸 150ppi",
      },
      {
        label: "游戏鼠标垫 (M)",
        width: 4134,
        height: 2953,
        description: "350x250mm 常见游戏规格",
      },
      {
        label: "法兰绒毛毯",
        width: 4167,
        height: 5000,
        description: "50x60英寸 150ppi",
      },
      {
        label: "大号游戏鼠标垫",
        width: 3543,
        height: 2953,
        description: "300x250mm 游戏/办公两用",
      },
      {
        label: "常规办公鼠标垫",
        width: 2835,
        height: 2362,
        description: "240x200mm",
      },
      {
        label: "标准鼠标垫",
        width: 2717,
        height: 2244,
        description: "230x190mm 常规通用款",
      },
      {
        label: "迷你鼠标垫",
        width: 2598,
        height: 2126,
        description: "220x180mm 小尺寸办公垫",
      },
      {
        label: "圆形鼠标垫",
        width: 2362,
        height: 2362,
        description: "直径200mm",
      },
      {
        label: "方形抱枕/靠枕",
        width: 4629,
        height: 4629,
        description: "18x18英寸",
      },
      {
        label: "手机壳背板 (苹果/安卓)",
        width: 1050,
        height: 1950,
        description: "兼容所有机型含初延",
      },
      {
        label: "方形贴纸套件",
        width: 1200,
        height: 1800,
        description: "4x6英寸 不干胶板",
      },
    ],
  },
  {
    label: "国内社交媒体 (移动端)",
    options: [
      {
        label: "微信公众号首图",
        width: 900,
        height: 383,
        description: "2.35:1 最佳比例",
      },
      {
        label: "B站(Bilibili)视频封面",
        width: 1146,
        height: 717,
        description: "1.6:1",
      },
      {
        label: "知乎文章封面图",
        width: 1920,
        height: 1080,
        description: "16:9 内容流顶部",
      },
      {
        label: "微信公众号次图",
        width: 200,
        height: 200,
        description: "1:1 方形",
      },
      {
        label: "微信朋友圈封面",
        width: 1200,
        height: 1200,
        description: "朋友圈相册背景墙",
      },
      {
        label: "微博正文配图",
        width: 1200,
        height: 1200,
        description: "宫格1:1或长图皆可",
      },
      {
        label: "小红书方图",
        width: 1080,
        height: 1080,
        description: "1:1 正方形图库",
      },
      {
        label: "小红书推荐竖图",
        width: 1080,
        height: 1350,
        description: "3:4 最占屏幅比例",
      },
      {
        label: "抖音/快手短视频封面",
        width: 1080,
        height: 1920,
        description: "9:16 全屏竖图",
      },
    ],
  },
  {
    label: "海外社交媒体 (出海投放)",
    options: [
      {
        label: "LinkedIn公司横幅",
        width: 1128,
        height: 191,
        description: "领英商业主页Banner",
      },
      {
        label: "Facebook封面背景",
        width: 1640,
        height: 624,
        description: "Facebook公共主页Banner",
      },
      {
        label: "Facebook单图广告/推文",
        width: 1200,
        height: 628,
        description: "带链接的标准广告尺寸",
      },
      {
        label: "X(Twitter)推文配图",
        width: 1200,
        height: 675,
        description: "16:9 防截断比例",
      },
      {
        label: "YouTube缩略图",
        width: 1280,
        height: 720,
        description: "油管视频封面 (推荐)",
      },
      {
        label: "YouTube频道横幅 (Banner)",
        width: 2560,
        height: 1440,
        description: "TV/PC/移动端安全区设定",
      },
      {
        label: "Instagram帖子 (正方)",
        width: 1080,
        height: 1080,
        description: "1:1",
      },
      {
        label: "Instagram帖子 (肖像)",
        width: 1080,
        height: 1350,
        description: "4:5 收割注意力",
      },
      {
        label: "Pinterest Pin竖图",
        width: 1000,
        height: 1500,
        description: "2:3 灵感板标准",
      },
      {
        label: "Instagram/FB快拍 (Story)",
        width: 1080,
        height: 1920,
        description: "9:16 全竖屏",
      },
      {
        label: "TikTok广告竖屏短视频",
        width: 1080,
        height: 1920,
        description: "推荐视频原始帧大小",
      },
    ],
  },
  {
    label: "贴纸 / 标签 (300 PPI 高清印刷)",
    options: [
      {
        label: "超宽贴纸 (2:1)",
        width: 6000,
        height: 3000,
        description: "50.8x25.4cm 横幅标签",
      },
      {
        label: "宽幅贴纸 (3:2)",
        width: 6000,
        height: 4000,
        description: "50.8x33.9cm 异形贴纸",
      },
      {
        label: "横幅贴纸 (16:9)",
        width: 5760,
        height: 3240,
        description: "48.8x27.4cm 长条贴纸",
      },
      {
        label: "横幅贴纸 (4:3)",
        width: 4800,
        height: 3600,
        description: "40.6x30.5cm",
      },
      {
        label: "方形大贴纸 (1:1)",
        width: 6000,
        height: 6000,
        description: "50.8x50.8cm 大型贴纸",
      },
      {
        label: "方形中贴纸 (1:1)",
        width: 4800,
        height: 4800,
        description: "40.6x40.6cm",
      },
      {
        label: "方形标准贴纸 (1:1)",
        width: 3600,
        height: 3600,
        description: "30.5x30.5cm 日常尺寸",
      },
      {
        label: "方形小贴纸 (1:1)",
        width: 2400,
        height: 2400,
        description: "20.3x20.3cm",
      },
      {
        label: "圆形贴纸",
        width: 3000,
        height: 3000,
        description: "直径25.4cm 圆形不干胶",
      },
      {
        label: "竖幅贴纸 (3:4)",
        width: 3600,
        height: 4800,
        description: "30.5x40.6cm 竖版标签",
      },
      {
        label: "竖幅贴纸 (2:3)",
        width: 4000,
        height: 6000,
        description: "33.9x50.8cm 长条竖贴",
      },
      {
        label: "竖幅贴纸 (4:5)",
        width: 4800,
        height: 6000,
        description: "40.6x50.8cm",
      },
      {
        label: "竖幅贴纸 (9:16)",
        width: 3240,
        height: 5760,
        description: "27.4x48.8cm 手机壳贴纸",
      },
      {
        label: "贴纸套版 (Letter)",
        width: 3300,
        height: 5100,
        description: "8.5x11英寸 整版贴纸页",
      },
      {
        label: "贴纸套版 (A4)",
        width: 3508,
        height: 4961,
        description: "21x29.7cm 整版贴纸页",
      },
    ],
  },
];

const filteredSizeGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return sizeGroups;
  }

  return sizeGroups
    .map((group) => {
      const groupMatched = group.label.toLowerCase().includes(keyword);
      const options = group.options.filter((item) => {
        const searchableText = [
          item.label,
          item.description,
          `${item.width}x${item.height}`,
          `${item.width} x ${item.height}`,
          `${item.width}/${item.height}`,
          formatDisplayRatio(item),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return groupMatched || searchableText.includes(keyword);
      });

      return {
        ...group,
        options,
      };
    })
    .filter((group) => group.options.length > 0);
});

const matchedPresetCount = computed(() => {
  return filteredSizeGroups.value.reduce(
    (count, group) => count + group.options.length,
    0,
  );
});

function formatDisplayRatio(item: SizeOption) {
  const width = Number(item.width || 0);
  const height = Number(item.height || 0);

  if (!width || !height) {
    return "1.00 : 1.00";
  }

  if (width >= height) {
    return `${(width / height).toFixed(2)} : 1.00`;
  }

  return `1.00 : ${(height / width).toFixed(2)}`;
}

function getRatioStyle(item: SizeOption) {
  const ratio = item.width / item.height;
  const MAX_SIZE = 36;
  let w, h;
  if (ratio > 1) {
    w = MAX_SIZE;
    h = MAX_SIZE / ratio;
  } else {
    h = MAX_SIZE;
    w = MAX_SIZE * ratio;
  }
  return {
    width: `${w}px`,
    height: `${h}px`,
    borderRadius: "2px",
    backgroundColor: "#e4e7ed",
    border: "1px solid #dcdfe6",
    transition: "all 0.2s ease",
  };
}

function handleSelect(item: SizeOption) {
  emit("select", {
    width: item.width,
    height: item.height,
  });
  dialogVisible.value = false;
}
</script>

<style scoped>
.preset-container {
  height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 0 20px 40px;
}

.preset-search {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0 16px;
  margin-bottom: 8px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
}

.preset-search-input {
  max-width: 420px;
}

.preset-search-meta {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.preset-empty {
  padding: 48px 0;
  text-align: center;
  font-size: 13px;
  color: #909399;
}

.preset-container::-webkit-scrollbar {
  width: 6px;
}
.preset-container::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 4px;
}

.preset-group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f0f0f0;
  color: #606266;
}

.preset-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}

.preset-card {
  border-radius: 6px;
  padding: 12px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  border: 1px solid transparent;
}

.preset-card:hover {
  background-color: #f0f4ff;
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-1px);
}

.preset-card:hover .aspect-ratio-box {
  background-color: var(--el-color-primary-light-8) !important;
  border-color: var(--el-color-primary) !important;
}

.preview-box {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.preset-info {
  text-align: center;
  width: 100%;
}

.preset-label {
  font-weight: 500;
  font-size: 12px;
  margin-bottom: 4px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preset-size {
  font-size: 11px;
  color: #909399;
}

.preset-ratio {
  font-size: 11px;
  color: #606266;
  margin-top: 2px;
}

.preset-desc {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .preset-search {
    align-items: stretch;
    flex-direction: column;
  }

  .preset-search-input {
    max-width: none;
    width: 100%;
  }

  .preset-search-meta {
    width: 100%;
    text-align: left;
  }
}

/* 比例选择模式样式 */
.ratio-custom-container {
  padding: 0 16px 24px;
}

.ratio-description {
  font-size: 12px;
  color: #909399;
  margin-bottom: 16px;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.ratio-category {
  margin-bottom: 20px;
}

.category-title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 14px;
}

.category-desc {
  font-size: 11px;
  font-weight: 400;
  color: #909399;
  margin-left: 4px;
}

.ratio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.ratio-card {
  border-radius: 6px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f8f9fa;
  border: 1px solid #e4e7ed;
}

.ratio-card:hover {
  background-color: #f0f4ff;
  border-color: var(--el-color-primary-light-5);
  transform: translateY(-1px);
}

.ratio-preview {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ratio-inner {
  width: 100%;
  height: 100%;
  background-color: #dcdfe6;
  border: 1px solid #c0c4cc;
  border-radius: 2px;
  transition: all 0.15s ease;
}

.ratio-card:hover .ratio-inner {
  background-color: var(--el-color-primary-light-7);
  border-color: var(--el-color-primary);
}

.ratio-info {
  flex: 1;
  min-width: 0;
}

.ratio-label {
  font-weight: 700;
  font-size: 13px;
  color: #303133;
  margin-bottom: 1px;
}

.ratio-name {
  font-size: 11px;
  color: #606266;
  margin-bottom: 2px;
}

.ratio-usage {
  font-size: 10px;
  color: #909399;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 比例尺寸弹窗样式 */
.ratio-dialog-content {
  padding: 0;
}

.ratio-dialog-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 16px;
}

.ratio-dialog-section {
  margin-bottom: 16px;
}

.section-label {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.width-quick-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.custom-width-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.width-label {
  font-size: 12px;
  color: #606266;
}

.custom-width-input {
  width: 150px;
}

.width-unit {
  font-size: 12px;
  color: #909399;
}

.ratio-dialog-result {
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 6px;
  text-align: center;
}

.result-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 8px;
}

.result-width,
.result-height {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  font-family: monospace;
}

.result-x {
  font-size: 18px;
  color: #909399;
}

.result-unit {
  font-size: 13px;
  color: #909399;
}

.preset-tabs {
  margin-bottom: 16px;
}
</style>
