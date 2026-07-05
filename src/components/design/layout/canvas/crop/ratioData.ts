/**
 * 共享比例数据源
 * 裁剪参考线 和 常用尺寸比例 共用此数据
 * 去重后只保留合适的独立比例
 */

export interface RatioOption {
  name: string
  width: number
  height: number
  display: string
  description: string
  usage: string
}

export interface RatioCategory {
  label: string
  description: string
  ratios: RatioOption[]
}

/** 所有比例分类 */
export const ratioCategories: RatioCategory[] = [
  {
    label: "竖屏",
    description: "适合手机壳、竖版海报、短视频",
    ratios: [
      { name: "超窄竖图", width: 1, height: 4, display: "1:4", description: "极限竖长比例", usage: "袖子印花、超长标签" },
      { name: "窄竖图", width: 1, height: 3, display: "1:3", description: "竖长比例", usage: "手机壳全包、袖标" },
      { name: "竖长图", width: 1, height: 2.5, display: "1:2.5", description: "竖长比例", usage: "手机壳背板" },
      { name: "竖长图", width: 1, height: 2, display: "1:2", description: "经典竖长比例", usage: "易拉宝、X展架" },
      { name: "iPhone全面屏", width: 9, height: 19.5, display: "9:19.5", description: "iPhone全面屏", usage: "iPhone壁纸、App截图" },
      { name: "竖屏视频", width: 9, height: 16, display: "9:16", description: "竖屏全屏比例", usage: "抖音/快手/Reels、手机壁纸" },
      { name: "竖版海报", width: 9, height: 14, display: "9:14", description: "竖版展架比例", usage: "竖版展架、人形立牌" },
      { name: "竖版印刷", width: 9, height: 12, display: "9:12", description: "竖版印刷比例", usage: "竖版海报、传单" },
      { name: "竖版海报", width: 3, height: 4, display: "3:4", description: "标准竖版比例", usage: "小红书推荐、朋友圈" },
      { name: "竖版长图", width: 2, height: 3, display: "2:3", description: "经典竖版比例", usage: "小红书竖图、Pinterest" },
      { name: "竖版近方", width: 4, height: 5, display: "4:5", description: "Instagram竖图", usage: "Instagram竖图、商品主图" },
      { name: "竖版近方", width: 5, height: 6, display: "5:6", description: "竖版近方", usage: "电商详情图" },
      { name: "竖版近方", width: 3, height: 5, display: "3:5", description: "竖版窄图", usage: "竖版广告、窄幅海报" },
      { name: "竖版近方", width: 5, height: 7, display: "5:7", description: "竖版近方", usage: "竖版封面、贺卡" },
      { name: "竖版近方", width: 4, height: 7, display: "4:7", description: "竖版窄图", usage: "竖版标签、窄幅设计" },
      { name: "竖版近方", width: 3, height: 7, display: "3:7", description: "竖版窄图", usage: "竖条装饰、窄幅海报" },
      { name: "竖版近方", width: 6, height: 7, display: "6:7", description: "竖版近方", usage: "竖版封面" },
      { name: "竖版近方", width: 7, height: 8, display: "7:8", description: "竖版近方", usage: "竖版卡片" },
      { name: "竖版近方", width: 4, height: 9, display: "4:9", description: "竖版窄图", usage: "手机壳侧面、窄条装饰" },
      { name: "竖版近方", width: 8, height: 9, display: "8:9", description: "接近正方形", usage: "竖版广告" },
    ],
  },
  {
    label: "正方形",
    description: "1:1比例，适合头像、Logo、商品主图",
    ratios: [
      { name: "正方形", width: 1, height: 1, display: "1:1", description: "完美正方形", usage: "头像、Logo、Instagram、贴纸" },
    ],
  },
  {
    label: "国旗标准比例",
    description: "世界各国国旗标准比例",
    ratios: [
      { name: "中国国旗", width: 3, height: 2, display: "3:2", description: "中国国旗标准比例", usage: "中国国旗 1-5号" },
      { name: "日本国旗", width: 3, height: 2, display: "3:2", description: "日本国旗标准比例", usage: "日之丸" },
      { name: "韩国国旗", width: 3, height: 2, display: "3:2", description: "韩国国旗标准比例", usage: "太极旗" },
      { name: "法国国旗", width: 3, height: 2, display: "3:2", description: "法国国旗标准比例", usage: "三色旗" },
      { name: "意大利国旗", width: 3, height: 2, display: "3:2", description: "意大利国旗标准比例", usage: "三色旗" },
      { name: "俄罗斯国旗", width: 3, height: 2, display: "3:2", description: "俄罗斯国旗标准比例", usage: "三色旗" },
      { name: "印度国旗", width: 3, height: 2, display: "3:2", description: "印度国旗标准比例", usage: "三色旗" },
      { name: "德国国旗", width: 5, height: 3, display: "5:3", description: "德国国旗标准比例", usage: "三色旗" },
      { name: "美国国旗", width: 1.9, height: 1, display: "1.9:1", description: "美国国旗标准比例", usage: "星条旗" },
      { name: "英国国旗", width: 2, height: 1, display: "2:1", description: "英国国旗标准比例", usage: "米字旗" },
      { name: "加拿大国旗", width: 2, height: 1, display: "2:1", description: "加拿大国旗标准比例", usage: "枫叶旗" },
      { name: "澳大利亚国旗", width: 2, height: 1, display: "2:1", description: "澳大利亚国旗标准比例", usage: "南十字星旗" },
      { name: "巴西国旗", width: 10, height: 7, display: "10:7", description: "巴西国旗标准比例", usage: "巴西国旗" },
      { name: "奥林匹克旗帜", width: 8, height: 5, display: "8:5", description: "奥林匹克旗帜比例", usage: "奥运会五环旗" },
      { name: "联合国旗帜", width: 3, height: 2, display: "3:2", description: "联合国旗帜比例", usage: "联合国旗" },
    ],
  },
  {
    label: "证件照标准比例",
    description: "各类证件照标准尺寸比例",
    ratios: [
      { name: "一寸证件照", width: 25, height: 35, display: "25:35", description: "一寸证件照 25×35mm", usage: "身份证、学生证、工作证" },
      { name: "二寸证件照", width: 35, height: 49, display: "35:49", description: "二寸证件照 35×49mm", usage: "护照、签证" },
      { name: "小二寸证件照", width: 35, height: 45, display: "35:45", description: "小二寸 35×45mm", usage: "护照、签证标准" },
      { name: "大一寸证件照", width: 33, height: 48, display: "33:48", description: "大一寸 33×48mm", usage: "港澳通行证" },
      { name: "美国护照照片", width: 2, height: 2, display: "1:1", description: "美国护照 2×2英寸", usage: "美国签证、护照" },
      { name: "申根签证照片", width: 35, height: 45, display: "35:45", description: "申根签证 35×45mm", usage: "欧洲签证" },
    ],
  },
  {
    label: "卡片标准比例",
    description: "银行卡、名片、IC卡等标准尺寸比例",
    ratios: [
      { name: "银行卡/IC卡", width: 85.6, height: 53.98, display: "85.6:54", description: "ISO/IEC 7810 ID-1 标准", usage: "银行卡、信用卡、身份证、VIP卡" },
      { name: "名片 (横版)", width: 90, height: 54, display: "90:54", description: "中国标准名片 90×54mm", usage: "名片、商务卡" },
      { name: "名片 (竖版)", width: 54, height: 90, display: "54:90", description: "竖版名片 54×90mm", usage: "名片" },
      { name: "门禁卡/工牌", width: 54, height: 86, display: "54:86", description: "竖版工牌 54×86mm", usage: "工牌、胸牌" },
      { name: "入场券/门票", width: 200, height: 80, display: "5:2", description: "横版门票 200×80mm", usage: "门票、入场券" },
      { name: "书签", width: 50, height: 150, display: "1:3", description: "书签 50×150mm", usage: "书签" },
      { name: "红包封面", width: 95, height: 175, display: "19:35", description: "竖版红包", usage: "红包封面" },
    ],
  },
  {
    label: "横版近方",
    description: "适合横版照片、封面",
    ratios: [
      { name: "横版近方", width: 9, height: 8, display: "9:8", description: "横版近方", usage: "横版广告" },
      { name: "横版近方", width: 8, height: 7, display: "8:7", description: "横版近方", usage: "微信封面" },
      { name: "横版近方", width: 7, height: 6, display: "7:6", description: "横版近方", usage: "产品展示" },
      { name: "横版近方", width: 6, height: 5, display: "6:5", description: "横版近方", usage: "横版封面、电商Banner" },
      { name: "横版照片", width: 5, height: 4, display: "5:4", description: "横版照片比例", usage: "Etsy商品图、Facebook封面" },
      { name: "横版近方", width: 9, height: 4, display: "9:4", description: "横版宽图", usage: "网页横幅、宽幅Banner" },
      { name: "横版近方", width: 7, height: 4, display: "7:4", description: "横版宽图", usage: "横版海报、宽幅广告" },
      { name: "横版近方", width: 7, height: 3, display: "7:3", description: "横版宽图", usage: "网页通栏、横幅广告" },
      { name: "横版近方", width: 8, height: 3, display: "8:3", description: "横版宽图", usage: "宽幅Banner、横幅" },
      { name: "横版近方", width: 9, height: 5, display: "9:5", description: "横版宽图", usage: "横版广告、宽幅封面" },
      { name: "横版近方", width: 5, height: 3, display: "5:3", description: "横版宽图", usage: "欧洲护照、横版照片" },
      { name: "横版近方", width: 7, height: 5, display: "7:5", description: "横版照片", usage: "横版照片、海报" },
      { name: "横版近方", width: 8, height: 5, display: "8:5", description: "横版宽图", usage: "宽屏显示器、横版Banner" },
      { name: "横版近方", width: 6, height: 4, display: "6:4", description: "横版照片", usage: "3:2的等效比例" },
      { name: "横版近方", width: 9, height: 7, display: "9:7", description: "横版近方", usage: "横版广告" },
    ],
  },
  {
    label: "经典横版",
    description: "适合屏幕显示、照片、演示文稿",
    ratios: [
      { name: "传统屏幕", width: 4, height: 3, display: "4:3", description: "传统屏幕/照片比例", usage: "iPad屏幕、PPT" },
      { name: "横版宽图", width: 3, height: 2, display: "3:2", description: "经典摄影比例", usage: "单反照片、摄影作品" },
      { name: "黄金比例", width: 1.618, height: 1, display: "1.618:1", description: "黄金分割比例", usage: "艺术构图、品牌设计" },
      { name: "横版宽图", width: 5, height: 2, display: "5:2", description: "横版宽幅", usage: "网页Banner、横幅" },
      { name: "横版宽图", width: 6, height: 2, display: "6:2", description: "横版超宽", usage: "网页通栏、超宽Banner" },
    ],
  },
  {
    label: "宽屏",
    description: "适合电脑屏幕、视频、壁纸",
    ratios: [
      { name: "MacBook屏幕", width: 16, height: 10, display: "16:10", description: "MacBook/显示器", usage: "MacBook、显示器壁纸" },
      { name: "高清宽屏", width: 16, height: 9, display: "16:9", description: "主流宽屏比例", usage: "YouTube、电脑壁纸、PPT" },
      { name: "电影宽屏", width: 18, height: 9, display: "18:9", description: "电影/手机横屏", usage: "电影海报" },
      { name: "超宽屏", width: 21, height: 9, display: "21:9", description: "带鱼屏/电影比例", usage: "带鱼屏显示器" },
    ],
  },
  {
    label: "超宽横图",
    description: "适合Banner、横幅、全景图",
    ratios: [
      { name: "超宽", width: 2, height: 1, display: "2:1", description: "超宽比例", usage: "全景图、网页Banner" },
      { name: "公众号首图", width: 2.35, height: 1, display: "2.35:1", description: "电影宽银幕比例", usage: "微信公众号首图" },
      { name: "超宽横幅", width: 3, height: 1, display: "3:1", description: "超宽横幅比例", usage: "网页通栏、户外横幅" },
      { name: "极限横宽", width: 4, height: 1, display: "4:1", description: "极限横宽比例", usage: "超长横幅、轮播图" },
      { name: "超宽横幅", width: 6, height: 1, display: "6:1", description: "超宽横幅", usage: "户外大型横幅" },
      { name: "超宽横幅", width: 8, height: 1, display: "8:1", description: "极限超宽", usage: "超长横幅、建筑外墙" },
    ],
  },
]

/** 获取所有比例的扁平列表（去重） */
export function getAllRatios(): RatioOption[] {
  return ratioCategories.flatMap(c => c.ratios)
}

/** 根据 width/height 获取比例的显示文本 */
export function formatRatioDisplay(width: number, height: number): string {
  if (!width || !height) return '1:1'
  const ratio = width / height
  // 查找匹配的预设比例
  for (const cat of ratioCategories) {
    for (const r of cat.ratios) {
      if (Math.abs(r.width / r.height - ratio) < 0.01) {
        return r.display
      }
    }
  }
  // 没找到匹配的，计算最简整数比
  const g = gcd(Math.round(width), Math.round(height))
  const w = Math.round(width / g)
  const h = Math.round(height / g)
  if (w > 100 || h > 100) return `${width}:${height}`
  return `${w}:${h}`
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}
