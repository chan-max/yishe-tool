import { ref } from 'vue'


export const basicClothingOptions = ref([
    { text: 'T恤' },
    { text: '短袖' },
    { text: '背心' },
    { text: '带领T恤' },
    { text: '卫衣' },
    { text: '帽子' },
    { text: '棒球帽' },
    { text: '短裤' },
    { text: '夹克' },
    { text: '裙子' },
    { text: '内衣' }
])

export const clothingStyleOptions = ref([
    { text: "休闲", value: "casual", color: "#4B8BBE" }, // 深蓝色
    { text: "商务", value: "business", color: "#2C3E50" }, // 深灰色
    { text: "运动", value: "sporty", color: "#C0392B" }, // 深红色
    { text: "正式", value: "formal", color: "#34495E" }, // 深蓝灰色
    { text: "街头", value: "street", color: "#7D3C98" }, // 深紫色
    { text: "优雅", value: "elegant", color: "#8E44AD" }, // 深紫罗兰色
    { text: "复古", value: "vintage", color: "#A0522D" }, // 深棕色
    { text: "时尚", value: "fashion", color: "#D35400" }, // 深橙色
    { text: "简约", value: "minimalist", color: "#BDC3C7" }, // 深灰白色
    { text: "波西米亚", value: "bohemian", color: "#9B59B6" }, // 深紫色
    { text: "职业", value: "professional", color: "#16A085" }, // 深青绿色
    { text: "户外", value: "outdoor", color: "#2ECC71" }, // 深绿松石色
    { text: "海滩", value: "beach", color: "#F39C12" }, // 深金色
    { text: "民族", value: "ethnic", color: "#E74C3C" }, // 深红橙色
    { text: "工装", value: "workwear", color: "#7F8C8D" }, // 深灰蓝色
    { text: "田园", value: "country", color: "#D5DBDB" }, // 浅灰色
    { text: "现代", value: "modern", color: "#2980B9" }, // 深蓝色
    { text: "朋克", value: "punk", color: "#A93226" }, // 深红色
    { text: "学院", value: "preppy", color: "#5D6D7E" }, // 深蓝灰色

    // 新增分类
    { text: "瑞丽", value: "ruili", color: "#A569BD" }, // 深紫红色
    { text: "嘻皮", value: "hippie", color: "#F39C12" }, // 深金黄色
    { text: "百搭", value: "versatile", color: "#7D7D7D" }, // 中灰色
    { text: "淑女", value: "lady", color: "#8E44AD" }, // 深紫罗兰色
    { text: "韩版", value: "korean", color: "#5499C7" }, // 深青蓝色
    { text: "民族", value: "ethnic", color: "#E76F51" }, // 深红橙色
    { text: "欧美", value: "european", color: "#5D6D7E" }, // 深灰蓝色
    { text: "学院", value: "preppy", color: "#34495E" }, // 深蓝灰色
    { text: "通勤", value: "commuting", color: "#1F618D" }, // 深蓝色
    { text: "中性", value: "androgynous", color: "#2C3E50" }, // 深灰色
    { text: "嘻哈", value: "hiphop", color: "#922B21" }, // 深红色
    { text: "田园", value: "country", color: "#A0522D" }, // 深棕色
    { text: "朋克", value: "punk", color: "#A93226" }, // 深红色
    { text: "OL", value: "ol", color: "#2C3E50" }, // 深灰色
    { text: "洛丽塔", value: "lolita", color: "#DA70D6" }, // 中紫色
    { text: "街头 ", value: "street ", color: "#7D3C98" }, // 深紫色 
    { text: "简约 ", value: "minimalist ", color: "#BDC3C7" }, // 深灰白色 
    { text: "波西米亚 ", value: "bohemian ", color: "#9B59B6" }, // 深紫色 
    { text: "巴洛克 ", value: "baroque ", color: "#8B4513" }, // 深棕 
    { text: "哥特 ", value: "gothic ", color: "#4B0082" }, // 靛蓝 
    { text: "未来主义 ", value: "futuristic ", color: "#4682B4" }, // 钢蓝 
])


export const clothingColorOptions = ref([
    { text: "白色", value: "white" },
    { text: "黑色", value: "black" },
    { text: "红色", value: "red" },
    { text: "绿色", value: "green" },
    { text: "蓝色", value: "blue" },
    { text: "黄色", value: "yellow" },
    { text: "紫色", value: "purple" },
    { text: "橙色", value: "orange" },
    { text: "粉红色", value: "pink" },
    { text: "灰色", value: "gray" },
    { text: "深红色", value: "darkred" },
    { text: "浅蓝色", value: "lightblue" },
    { text: "深蓝色", value: "darkblue" },
    { text: "浅绿色", value: "lightgreen" },
    { text: "金色", value: "gold" },
    { text: "银色", value: "silver" },
    { text: "米色", value: "beige" },
    { text: "青色", value: "cyan" },
    { text: "洋红色", value: "magenta" },
    { text: "橄榄色", value: "olive" },
    { text: "深紫色", value: "darkviolet" },
    { text: "浅紫色", value: "lavender" },
    { text: "淡粉红色", value: "lightpink" },
    { text: "桃红色", value: "hotpink" },
    { text: "草绿色", value: "limegreen" },
    { text: "深绿色", value: "darkgreen" },
    { text: "棕色", value: "brown" },
    { text: "暗灰色", value: "dimgray" },
    { text: "淡黄色", value: "lightyellow" },
    { text: "淡紫色", value: "thistle" },
    { text: "深橙色", value: "darkorange" },
    { text: "淡橙色", value: "lightsalmon" },
])

export const clothingContentOptions = ref([
    { text: "文字", value: "cat" },
    { text: "图片", value: "cat" },
    { text: "艺术字", value: "cat" },
    { text: "人像", value: "cat" },
    { text: "花", value: "flower" },
    { text: "狗", value: "cat" },
    { text: "猫", value: "cat" },
    { text: "糖果", value: "cat" },
    { text: "白云", value: "cloud" },
    { text: "树叶", value: "leaf" },
    { text: "星星", value: "star" },
    { text: "水滴", value: "water-drop" },
    { text: "山脉", value: "mountain" },
    { text: "草地", value: "grass" },
    { text: "太阳", value: "sun" },
    { text: "月亮", value: "moon" },
    { text: "鱼", value: "fish" },
    { text: "鸟", value: "bird" },
    { text: "玫瑰", value: "rose" },
    { text: "心形", value: "heart" },
    { text: "风车", value: "windmill" },
    { text: "波浪", value: "wave" },
    { text: "果实", value: "fruit" },
    { text: "雪花", value: "snowflake" },
    { text: "沙滩", value: "beach" },
    { text: "蝴蝶", value: "butterfly" }
])