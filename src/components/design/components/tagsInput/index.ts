


export const fontAutoplacementTags = [
    { text: '中文' },
    { text: '繁体字' },
    { text: '英文' },
    { text: '通用' },
    { text: '日文' },
    { text: '黑体' },
    { text: '宋体' },
    { text: '动漫' },
    { text: '动画' },
    { text: '卡通' },
    { text: '字重' },
    { text: '字宽' },
    { text: '小写字高' },
    { text: '大写字高' },
    { text: '拉丁文' },
    { text: '西里尔文' },
    { text: '希腊文' },
    { text: '中日韩文字' },
    { text: '标题字体' },
    { text: '正文字体' },
    { text: '标志字体' },
    { text: '海报字体' },
    { text: '网页字体' },
    { text: '现代风格' },
    { text: '经典风格' },
    { text: '复古风格' },
    { text: '极简风格' },
    { text: '装饰风格' },
    { text: '连字' },
    { text: '小型大写字母' },
    { text: '替代字形' },
    { text: '花饰字形' },
    { text: '字偶距' },
    { text: '设计师' },
    { text: '字体厂商' },
    { text: '创建年份' },
    { text: '更新年份' },
    { text: '宋体' },
    { text: '黑体' },
    { text: '楷体' },
    { text: '仿宋' },
    { text: '隶书' },
    { text: '篆书' },
    { text: '粗笔画' },
    { text: '细笔画' },
    { text: '圆润' },
    { text: '方正' },
    { text: '扁平结构' },
    { text: '紧凑结构' },
    { text: '舒展结构' },
    { text: '简体中文' },
    { text: '繁体中文' },
    { text: '港台风格' },
    { text: '日本风格' }
];



export const imageAutoplacementTags = [
    { "text": "文字类" },
    { "text": "现代风" },           // 现代设计风格
    { "text": "复古风" },           // 怀旧感设计
    { "text": "极简风" },           // 简约设计
    { "text": "自然景" },           // 自然相关图像
    { "text": "城市景" },           // 城市建筑与生活
    { "text": "艺术插" },           // 艺术风格插图
    { "text": "商业用" },           // 商业用途图片
    { "text": "社媒图" },           // 社交媒体分享图片
    { "text": "教育用" },           // 教育相关图像
    { "text": "科技感" },           // 科技主题设计
    { "text": "运动风" },           // 运动主题图像
    { "text": "时尚风" },           // 时尚潮流相关
    { "text": "生活美" },           // 生活方式相关图像
    { "text": "旅行记" },           // 旅行与探险主题
    { "text": "美食图" }
]

export const stickerAutoplacementTags = [
    { text: '图片' },
    { text: '文字' },
    { text: '印章' },
    { text: '徽章' },
]




import { clothingColorOptions, basicClothingOptions, clothingContentOptions, clothingStyleOptions } from "./meta";

export const customModelAutoplacementTags = [
    // 款式
    ...basicClothingOptions.value,
    { text: "可定制", },
    { text: "不可定制" },

    ...clothingColorOptions.value,
    ...clothingStyleOptions.value,
    ...clothingContentOptions.value
]