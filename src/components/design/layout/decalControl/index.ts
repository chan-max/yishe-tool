import { ref } from 'vue'


let commonSrc = '/yinhuagongyiyulantu/'

// 服装印花工艺
export const clothingPaintMethods = ref([
    {
        title: '胶浆印花',
        description: `这是一种特殊的印染技术，通过化学凝胶与染料的混合，使染料牢固地附着在面料上。胶浆印花色彩艳丽、还原度高，可以大面积印制多种颜色，遮盖性强。然而，它的缺点是在热天容易粘连，手感较硬`,
        thumbnail: '/image/yinhuagongyiyulantu/jiaojiangyinhua.jpg'
    },
    {
        title: '反光印花',
        description: `它通过在油墨中加入反光材料，使印花部分在光照下呈现高亮状态，起到警示作用。这种印花工艺在夜间驾驶者的视野中尤为醒目，常被用于制作安全服或标志。但需要注意的是，反光印花容易开裂，且不耐洗。`,
        thumbnail: '/image/yinhuagongyiyulantu/fanguangyinhua.jpg'
    },
    {
        title: '光变印花',
        description: `一种利用紫外光激发染料中微胶粒的印花工艺。当阳光照射到花位时，色彩会瞬间发生变化，离开阳光后又能迅速恢复原状。这种印花工艺为服装增添了趣味性和科技感，但同样存在易开裂、不耐洗的问题。`,
        thumbnail: '/image/yinhuagongyiyulantu/guangbianyinhua.jpg'
    },
    {
        title: '厚板印花',
        description: `又称发泡印花，其特点在于印物具有立体感。这种印花工艺可以达到非常整齐的立体效果，但成本相对较高，适用于各类针织面料`,
        thumbnail: '/image/yinhuagongyiyulantu/houbanyinhua.jpg',
    },
    {
        title: '植绒印花',
        description: `一种利用转移印花技术，将绒毛按照特定图案粘着到织物表面的方法。这种印花工艺使织物获得立体绒绣感花纹效果，手感柔软且保暖性好，但洗涤次数增加时容易脱落，有粘毛现象。`,
        thumbnail: '/image/yinhuagongyiyulantu/zhirongyinhua.jpg',
    },
    {
        title: '转移印花',
        description: `是将染料或色料先印在纸上或其他材料上，再通过热压等方式转移到织物上。这种印花工艺花纹精细、层次丰富，艺术性高，但耗费大量转移纸且会产生污水。`,
        thumbnail: '/image/yinhuagongyiyulantu/zhuanyiyinhua.jpg',
    },
    {
        title: '数码印花',
        description: `是一种采用数码技术进行纺织品印花的方法。它可以通过计算机编辑与修改设计图案，快速打印在织物上。数码印花反应速度快、打样效果好，但喷印速度慢且墨水价格较高。`,
        thumbnail: '/image/yinhuagongyiyulantu/shumayinhua.jpg',
    },
    {
        title: '渗透印花',
        description: `则利用色浆的渗透作用，使正反面色泽基本相近。这种印花工艺手感柔软且应用广泛，但颜色可能不太鲜艳。`,
        thumbnail: '/image/yinhuagongyiyulantu/shentouyinhua.jpg',
    },
    {
        title: '油墨印花',
        description: `采用化学油墨作为印花材料，通过高温烘干使油墨凝固在织物纤维中。油墨印花图案清晰、色彩亮丽且手感柔软，但价格相对较高且对织物要求较为疏松轻薄`,
        thumbnail: '/image/yinhuagongyiyulantu/youmoyinhua.jpg',
    },
    {
        title: '硅胶印花',
        description: `利用硅胶作为印花材料，通过特定的印刷技术将图案或文字印制到各种纤维织物上。这种印花工艺具有手感柔软、耐洗耐穿、色牢度强以及可塑性高的优点，但成本较高，不适合大面积印花。它适用于各种纤维织物，为服装带来独特的触感和视觉效果。`,
        thumbnail: '/image/yinhuagongyiyulantu/youmoyinhua.jpg',
    },
    {
        title: '涂料印花',
        description: `是一种采用涂料直接印花的工艺，主要材料是涂料，这是一种非水溶性着色物质。涂料印花通过高分子化合物的包覆和粘着作用来实现着色，具有明亮艳丽的色泽、光照稳定性好、手感丰满干爽柔软以及水洗牢度优良等特点。然而，涂料印花区域相比未印花区域手感稍硬一些，也许更厚一些。这种印花工艺适用于各种纤维织物，为服装增添丰富的色彩和纹理。`,
        thumbnail: '/image/yinhuagongyiyulantu/youmoyinhua.jpg',
    },
    {
        title: '拔染印花',
        description: `是一种利用还原剂或氧化剂将织物上已经染色的部分破坏，从而露出白色或有色花纹的印花工艺。它通常用于已经染色的织物，可以获得更为细致和精致的图案，并且轮廓清晰、边缘不露白。拔染印花手感柔软，但存在异味且颜色难以把握，容易变色。这种工艺同样适用于各种纤维织物，为服装带来独特的视觉效果。`,
        thumbnail: '/image/yinhuagongyiyulantu/boranyinhua.jpg',
    },
    {
        title: '水浆印花',
        description: `我国最早使用的印花技术之一，采用水性浆料进行印花。它主要用于印制浅色面料上的深色图案，具有应用广泛、花位牢固性好、手感较软以及价格较便宜等优点。然而，水浆印花的覆盖力不强，颜色不太鲜艳。因此，它更适合印在浅色面料上，为服装带来柔和而经济的装饰效果。`,
        thumbnail: '/image/yinhuagongyiyulantu/shuijiangyinhua.jpg',
    },



])