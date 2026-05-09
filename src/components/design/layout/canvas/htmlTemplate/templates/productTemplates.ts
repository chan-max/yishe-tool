import type { HtmlTemplateDefinition } from "../types";
import {
  colorField,
  createPureColor,
  createTemplate,
  defaultFontBinding,
  fontField,
  imageField,
  textField,
  textareaField,
} from "./shared";

export const productTemplates: HtmlTemplateDefinition[] = [
  createTemplate(
    {
      id: "product-card-split",
      name: "产品展示卡片",
      category: "商品展示",
      description: "左图右文的经典产品展示布局，适合鼠标垫、贴纸、杯子等商品主图。",
      tags: ["产品", "展示", "主图", "图文"],
      sortOrder: 10,
    },
    [
      imageField("image.hero", "产品图片"),
      textField("text.badge", "标签", "BEST SELLER"),
      textField("text.title", "商品名", "Premium Desk Mat"),
      textareaField("text.desc", "商品描述", "Smooth surface, vibrant colors, anti-slip base. Perfect for work and play.", 2),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      image: {
        hero: { id: "placeholder", name: "Product", url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600"><rect width="600" height="600" rx="40" fill="#f1f5f9"/><circle cx="300" cy="240" r="100" fill="#e2e8f0"/><rect x="180" y="380" width="240" height="24" rx="12" fill="#e2e8f0"/><rect x="220" y="420" width="160" height="16" rx="8" fill="#e2e8f0"/></svg>`) },
      },
      text: {
        badge: "BEST SELLER",
        title: "Premium Desk Mat",
        desc: "Smooth surface, vibrant colors, anti-slip base. Perfect for work and play.",
      },
      color: {
        bg: createPureColor("#f8fafc"),
        accent: createPureColor("#0f172a"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .pc-split{width:100%;height:100%;display:flex;background:{{color.bg}};overflow:hidden;}
      .pc-split__img{width:50%;height:100%;object-fit:cover;}
      .pc-split__body{width:50%;display:flex;flex-direction:column;justify-content:center;padding:8%;box-sizing:border-box;gap:16px;}
      .pc-split__badge{display:inline-flex;align-self:flex-start;padding:6px 14px;border-radius:999px;background:{{color.accent}};color:#fff;font-size:clamp(10px,1.2vw,12px);font-weight:700;letter-spacing:.12em;text-transform:uppercase;}
      .pc-split__title{font-size:clamp(24px,3.5vw,48px);line-height:1.1;font-weight:800;color:#0f172a;font-family:{{font.title.family}},sans-serif;margin:0;}
      .pc-split__desc{font-size:clamp(12px,1.4vw,15px);line-height:1.7;color:#475569;margin:0;}
      .pc-split__line{width:48px;height:3px;background:{{color.accent}};border-radius:2px;margin-top:8px;}
    </style>
    <div class="pc-split">
      <img class="pc-split__img" src="{{image.hero.url}}" alt="{{image.hero.name}}" />
      <div class="pc-split__body">
        <div class="pc-split__badge">{{text.badge}}</div>
        <h2 class="pc-split__title">{{text.title}}</h2>
        <p class="pc-split__desc">{{text.desc}}</p>
        <div class="pc-split__line"></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "sale-badge-circle",
      name: "圆形促销徽章",
      category: "营销促销",
      description: "圆形促销标签，适合商品折扣、限时活动、满减等促销场景。",
      tags: ["促销", "折扣", "徽章", "限时"],
      sortOrder: 20,
    },
    [
      textField("text.percent", "折扣数字", "50"),
      textField("text.label", "折扣标签", "OFF"),
      textField("text.sub", "副标题", "LIMITED TIME"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "数字字体"),
    ],
    {
      text: { percent: "50", label: "OFF", sub: "LIMITED TIME" },
      color: {
        bg: createPureColor("#fff"),
        accent: createPureColor("#ef4444"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .sale-badge{width:100%;height:100%;display:grid;place-items:center;background:{{color.bg}};font-family:{{font.title.family}},sans-serif;}
      .sale-badge__ring{width:min(85%,500px);aspect-ratio:1/1;border-radius:50%;border:clamp(6px,1.2vw,14px) solid {{color.accent}};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;}
      .sale-badge__ring::before{content:"";position:absolute;inset:clamp(8px,1.5vw,18px);border-radius:50%;border:2px dashed {{color.accent}};opacity:.35;}
      .sale-badge__num{font-size:clamp(48px,12vw,120px);font-weight:900;color:{{color.accent}};line-height:.9;letter-spacing:-.04em;}
      .sale-badge__label{font-size:clamp(20px,4vw,48px);font-weight:800;color:{{color.accent}};text-transform:uppercase;letter-spacing:.15em;margin-top:-4px;}
      .sale-badge__sub{font-size:clamp(10px,1.5vw,16px);font-weight:600;color:#64748b;letter-spacing:.2em;text-transform:uppercase;margin-top:8px;}
    </style>
    <div class="sale-badge">
      <div class="sale-badge__ring">
        <div class="sale-badge__num">{{text.percent}}</div>
        <div class="sale-badge__label">{{text.label}}</div>
        <div class="sale-badge__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "brand-emblem-badge",
      name: "品牌徽章",
      category: "品牌标识",
      description: "经典徽章风格的品牌标识，适合贴纸、吊牌、包装封口贴等场景。",
      tags: ["徽章", "品牌", "标识", "复古"],
      sortOrder: 30,
    },
    [
      textField("text.brand", "品牌名", "ATELIER"),
      textField("text.sub", "副标题", "EST. 2024"),
      textField("text.slogan", "标语", "Quality Craftsmanship"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "主色"),
      fontField("font.brand", "品牌字体"),
    ],
    {
      text: { brand: "ATELIER", sub: "EST. 2024", slogan: "Quality Craftsmanship" },
      color: {
        bg: createPureColor("#0f172a"),
        accent: createPureColor("#f8fafc"),
      },
      font: { brand: defaultFontBinding },
    },
    `<style>
      .emblem{width:100%;height:100%;display:grid;place-items:center;background:{{color.bg}};font-family:{{font.brand.family}},serif;}
      .emblem__shape{width:min(82%,480px);aspect-ratio:1/1;border-radius:50%;border:3px solid {{color.accent}};display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;padding:12%;box-sizing:border-box;}
      .emblem__shape::before{content:"";position:absolute;inset:6%;border-radius:50%;border:1.5px solid {{color.accent}};opacity:.3;}
      .emblem__shape::after{content:"";position:absolute;width:60%;height:1px;background:{{color.accent}};opacity:.2;top:50%;left:20%;}
      .emblem__brand{font-size:clamp(22px,4.5vw,52px);font-weight:700;letter-spacing:.25em;color:{{color.accent}};text-transform:uppercase;}
      .emblem__sub{font-size:clamp(10px,1.3vw,14px);letter-spacing:.3em;color:{{color.accent}};opacity:.6;margin-top:8px;}
      .emblem__slogan{font-size:clamp(11px,1.5vw,15px);letter-spacing:.12em;color:{{color.accent}};opacity:.8;margin-top:12px;font-style:italic;}
    </style>
    <div class="emblem">
      <div class="emblem__shape">
        <div class="emblem__brand">{{text.brand}}</div>
        <div class="emblem__sub">{{text.sub}}</div>
        <div class="emblem__slogan">{{text.slogan}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "thank-you-card",
      name: "感谢卡",
      category: "包装物料",
      description: "订单包裹随附的感谢卡，简洁温暖，适合 POD 商家出货使用。",
      tags: ["感谢卡", "包装", "插卡", "售后"],
      sortOrder: 40,
    },
    [
      imageField("image.logo", "品牌 Logo"),
      textField("text.title", "感谢语", "Thank You!"),
      textareaField("text.message", "正文", "We hope you love your new item. Every piece is made with care just for you.", 3),
      textField("text.social", "社媒账号", "@yourbrand"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      image: {
        logo: { id: "placeholder", name: "Logo", url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#e2e8f0"/><text x="100" y="108" text-anchor="middle" font-size="32" fill="#94a3b8" font-family="Arial">Logo</text></svg>`) },
      },
      text: {
        title: "Thank You!",
        message: "We hope you love your new item. Every piece is made with care just for you.",
        social: "@yourbrand",
      },
      color: {
        bg: createPureColor("#fffbeb"),
        accent: createPureColor("#d97706"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .ty-card{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10%;box-sizing:border-box;background:{{color.bg}};gap:16px;font-family:{{font.title.family}},sans-serif;}
      .ty-card__logo{width:min(20%,100px);aspect-ratio:1/1;border-radius:50%;object-fit:cover;}
      .ty-card__title{font-size:clamp(28px,5vw,56px);font-weight:800;color:#1e293b;margin:8px 0 0;letter-spacing:-.02em;}
      .ty-card__line{width:48px;height:3px;background:{{color.accent}};border-radius:2px;}
      .ty-card__msg{font-size:clamp(12px,1.5vw,16px);line-height:1.7;color:#475569;max-width:85%;}
      .ty-card__social{font-size:clamp(11px,1.3vw,14px);color:{{color.accent}};font-weight:600;margin-top:8px;letter-spacing:.05em;}
    </style>
    <div class="ty-card">
      <img class="ty-card__logo" src="{{image.logo.url}}" alt="logo" />
      <h1 class="ty-card__title">{{text.title}}</h1>
      <div class="ty-card__line"></div>
      <p class="ty-card__msg">{{text.message}}</p>
      <div class="ty-card__social">{{text.social}}</div>
    </div>`
  ),

  createTemplate(
    {
      id: "product-specs-grid",
      name: "产品信息卡",
      category: "商品展示",
      description: "网格布局展示产品卖点和规格，适合详情页配图、对比说明卡。",
      tags: ["产品", "信息", "规格", "卖点", "网格"],
      sortOrder: 50,
    },
    [
      textField("text.title", "标题", "Product Features"),
      textField("text.f1", "卖点 1", "Premium Material"),
      textField("text.f2", "卖点 2", "Vivid Colors"),
      textField("text.f3", "卖点 3", "Anti-Slip Base"),
      textField("text.f4", "卖点 4", "Easy Clean"),
      colorField("color.bg", "背景色"),
      colorField("color.card", "卡片色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: {
        title: "Product Features",
        f1: "Premium Material",
        f2: "Vivid Colors",
        f3: "Anti-Slip Base",
        f4: "Easy Clean",
      },
      color: {
        bg: createPureColor("#f1f5f9"),
        card: createPureColor("#ffffff"),
        accent: createPureColor("#3b82f6"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .specs-grid{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8%;box-sizing:border-box;background:{{color.bg}};gap:20px;font-family:{{font.title.family}},sans-serif;}
      .specs-grid__title{font-size:clamp(20px,3vw,36px);font-weight:800;color:#0f172a;text-align:center;margin:0;}
      .specs-grid__cards{display:grid;grid-template-columns:1fr 1fr;gap:clamp(8px,1.5vw,16px);width:100%;}
      .specs-grid__card{background:{{color.card}};border-radius:clamp(10px,1.5vw,16px);padding:clamp(14px,2.5vw,28px);display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;box-shadow:0 1px 3px rgba(0,0,0,.06);}
      .specs-grid__dot{width:clamp(28px,4vw,44px);aspect-ratio:1/1;border-radius:50%;background:{{color.accent}};opacity:.15;}
      .specs-grid__card-text{font-size:clamp(12px,1.4vw,15px);font-weight:700;color:#1e293b;letter-spacing:.02em;}
    </style>
    <div class="specs-grid">
      <h2 class="specs-grid__title">{{text.title}}</h2>
      <div class="specs-grid__cards">
        <div class="specs-grid__card"><div class="specs-grid__dot"></div><div class="specs-grid__card-text">{{text.f1}}</div></div>
        <div class="specs-grid__card"><div class="specs-grid__dot"></div><div class="specs-grid__card-text">{{text.f2}}</div></div>
        <div class="specs-grid__card"><div class="specs-grid__dot"></div><div class="specs-grid__card-text">{{text.f3}}</div></div>
        <div class="specs-grid__card"><div class="specs-grid__dot"></div><div class="specs-grid__card-text">{{text.f4}}</div></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "hang-tag-minimal",
      name: "极简吊牌",
      category: "包装物料",
      description: "简洁的品牌吊牌设计，适合服饰、配件、礼品类商品。",
      tags: ["吊牌", "标签", "品牌", "服饰"],
      sortOrder: 60,
    },
    [
      textField("text.brand", "品牌名", "STUDIO"),
      textField("text.line1", "系列名", "Everyday Collection"),
      textField("text.line2", "产地信息", "Designed in California"),
      colorField("color.bg", "底色"),
      colorField("color.text", "文字色"),
      fontField("font.brand", "品牌字体"),
    ],
    {
      text: {
        brand: "STUDIO",
        line1: "Everyday Collection",
        line2: "Designed in California",
      },
      color: {
        bg: createPureColor("#fafaf9"),
        text: createPureColor("#1c1917"),
      },
      font: { brand: defaultFontBinding },
    },
    `<style>
      .hang-tag{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:{{color.bg}};font-family:{{font.brand.family}},sans-serif;padding:8%;box-sizing:border-box;position:relative;}
      .hang-tag__hole{width:clamp(16px,3vw,28px);aspect-ratio:1/1;border-radius:50%;border:2px solid {{color.text}};opacity:.25;margin-bottom:20px;}
      .hang-tag__brand{font-size:clamp(32px,6vw,72px);font-weight:800;letter-spacing:.2em;color:{{color.text}};text-transform:uppercase;}
      .hang-tag__divider{width:40px;height:2px;background:{{color.text}};opacity:.2;margin:16px 0;border-radius:1px;}
      .hang-tag__line1{font-size:clamp(11px,1.4vw,14px);letter-spacing:.15em;color:{{color.text}};opacity:.6;text-transform:uppercase;}
      .hang-tag__line2{font-size:clamp(10px,1.2vw,12px);letter-spacing:.1em;color:{{color.text}};opacity:.4;margin-top:6px;}
    </style>
    <div class="hang-tag">
      <div class="hang-tag__hole"></div>
      <div class="hang-tag__brand">{{text.brand}}</div>
      <div class="hang-tag__divider"></div>
      <div class="hang-tag__line1">{{text.line1}}</div>
      <div class="hang-tag__line2">{{text.line2}}</div>
    </div>`
  ),

  createTemplate(
    {
      id: "quote-poster",
      name: "文字海报",
      category: "营销促销",
      description: "大标题极简排版，适合海报印花、帆布袋、T恤后背等大字场景。",
      tags: ["海报", "大字", "极简", "排版"],
      sortOrder: 70,
    },
    [
      textareaField("text.quote", "主文案", "Make Something\nBeautiful Today", 3),
      textField("text.foot", "底部署名", "STUDIO ONE"),
      colorField("color.bg", "背景色"),
      colorField("color.text", "文字色"),
      fontField("font.quote", "文案字体"),
    ],
    {
      text: {
        quote: "Make Something\nBeautiful Today",
        foot: "STUDIO ONE",
      },
      color: {
        bg: createPureColor("#0f172a"),
        text: createPureColor("#f8fafc"),
      },
      font: { quote: defaultFontBinding },
    },
    `<style>
      .quote-poster{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:{{color.bg}};padding:10%;box-sizing:border-box;text-align:center;position:relative;overflow:hidden;}
      .quote-poster::before{content:"";position:absolute;width:120%;height:120%;top:-10%;left:-10%;background:radial-gradient(circle at 30% 70%, rgba(255,255,255,.04), transparent 50%);}
      .quote-poster__text{font-size:clamp(32px,7vw,96px);line-height:1;font-weight:900;color:{{color.text}};white-space:pre-line;letter-spacing:-.03em;font-family:{{font.quote.family}},sans-serif;position:relative;z-index:1;}
      .quote-poster__line{width:36px;height:3px;background:{{color.text}};opacity:.25;margin:20px 0;border-radius:2px;}
      .quote-poster__foot{font-size:clamp(10px,1.3vw,13px);letter-spacing:.3em;color:{{color.text}};opacity:.45;text-transform:uppercase;position:relative;z-index:1;}
    </style>
    <div class="quote-poster">
      <div class="quote-poster__text">{{text.quote}}</div>
      <div class="quote-poster__line"></div>
      <div class="quote-poster__foot">{{text.foot}}</div>
    </div>`
  ),

  createTemplate(
    {
      id: "gradient-showcase",
      name: "渐变展示卡",
      category: "商品展示",
      description: "大面积渐变色块配文字，适合鼠标垫、桌垫、手机壳等纯视觉商品。",
      tags: ["渐变", "色彩", "氛围", "鼠标垫"],
      sortOrder: 80,
    },
    [
      textField("text.title", "标题", "Dreamscape"),
      textField("text.sub", "副标题", "Gradient Collection"),
      colorField("color.from", "起始色"),
      colorField("color.to", "终止色"),
      colorField("color.text", "文字色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "Dreamscape", sub: "Gradient Collection" },
      color: {
        from: createPureColor("#6366f1"),
        to: createPureColor("#ec4899"),
        text: createPureColor("#ffffff"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .grad-showcase{width:100%;height:100%;background:linear-gradient(135deg, {{color.from}}, {{color.to}});display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;position:relative;overflow:hidden;}
      .grad-showcase::before{content:"";position:absolute;width:80%;height:80%;border-radius:50%;background:rgba(255,255,255,.08);top:10%;left:10%;filter:blur(40px);}
      .grad-showcase::after{content:"";position:absolute;width:60%;height:60%;border-radius:50%;background:rgba(0,0,0,.06);bottom:-10%;right:-10%;filter:blur(50px);}
      .grad-showcase__title{font-size:clamp(40px,10vw,120px);font-weight:900;color:{{color.text}};letter-spacing:-.03em;line-height:.9;font-family:{{font.title.family}},sans-serif;position:relative;z-index:1;text-shadow:0 4px 20px rgba(0,0,0,.15);}
      .grad-showcase__sub{font-size:clamp(12px,1.8vw,18px);letter-spacing:.2em;color:{{color.text}};opacity:.7;margin-top:12px;text-transform:uppercase;position:relative;z-index:1;}
    </style>
    <div class="grad-showcase">
      <div class="grad-showcase__title">{{text.title}}</div>
      <div class="grad-showcase__sub">{{text.sub}}</div>
    </div>`
  ),

  createTemplate(
    {
      id: "label-price-tag",
      name: "价格标签",
      category: "营销促销",
      description: "价格信息展示标签，适合商品促销卡、折扣贴纸、价签设计。",
      tags: ["价格", "标签", "促销", "折扣"],
      sortOrder: 90,
    },
    [
      textField("text.currency", "货币符号", "¥"),
      textField("text.price", "价格", "99"),
      textField("text.original", "原价", "199"),
      textField("text.note", "说明", "限时特惠"),
      colorField("color.bg", "背景色"),
      colorField("color.price", "价格色"),
      fontField("font.price", "价格字体"),
    ],
    {
      text: { currency: "¥", price: "99", original: "199", note: "限时特惠" },
      color: {
        bg: createPureColor("#ffffff"),
        price: createPureColor("#ef4444"),
      },
      font: { price: defaultFontBinding },
    },
    `<style>
      .price-tag{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:{{color.bg}};padding:10%;box-sizing:border-box;gap:4px;font-family:{{font.price.family}},sans-serif;}
      .price-tag__note{font-size:clamp(11px,1.4vw,14px);letter-spacing:.2em;text-transform:uppercase;color:#64748b;font-weight:600;}
      .price-tag__main{display:flex;align-items:flex-start;justify-content:center;gap:4px;margin:4px 0;}
      .price-tag__currency{font-size:clamp(20px,4vw,40px);font-weight:700;color:{{color.price}};margin-top:clamp(4px,1vw,12px);}
      .price-tag__num{font-size:clamp(56px,12vw,120px);font-weight:900;color:{{color.price}};line-height:.85;letter-spacing:-.04em;}
      .price-tag__original{font-size:clamp(14px,2vw,22px);color:#94a3b8;text-decoration:line-through;margin-top:8px;}
      .price-tag__line{width:48px;height:2px;background:{{color.price}};opacity:.3;margin-top:8px;border-radius:1px;}
    </style>
    <div class="price-tag">
      <div class="price-tag__note">{{text.note}}</div>
      <div class="price-tag__main">
        <span class="price-tag__currency">{{text.currency}}</span>
        <span class="price-tag__num">{{text.price}}</span>
      </div>
      <div class="price-tag__original">{{text.currency}}{{text.original}}</div>
      <div class="price-tag__line"></div>
    </div>`
  ),

  createTemplate(
    {
      id: "minimal-text-card",
      name: "极简文字卡",
      category: "品牌标识",
      description: "纯文字极简排版，用留白和字重制造高级感，适合品牌标语、理念展示。",
      tags: ["极简", "文字", "品牌", "排版"],
      sortOrder: 100,
    },
    [
      textField("text.top", "顶部文字", "SIMPLICITY"),
      textField("text.main", "主文案", "Less Is More"),
      textField("text.bottom", "底部文字", "Quality over quantity"),
      colorField("color.bg", "背景色"),
      colorField("color.text", "文字色"),
      fontField("font.main", "主文案字体"),
    ],
    {
      text: { top: "SIMPLICITY", main: "Less Is More", bottom: "Quality over quantity" },
      color: {
        bg: createPureColor("#fafafa"),
        text: createPureColor("#171717"),
      },
      font: { main: defaultFontBinding },
    },
    `<style>
      .min-card{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:{{color.bg}};padding:10%;box-sizing:border-box;text-align:center;gap:12px;}
      .min-card__top{font-size:clamp(10px,1.2vw,12px);letter-spacing:.35em;color:{{color.text}};opacity:.35;text-transform:uppercase;}
      .min-card__main{font-size:clamp(30px,6vw,72px);font-weight:800;color:{{color.text}};line-height:1;font-family:{{font.main.family}},sans-serif;letter-spacing:-.02em;}
      .min-card__line{width:32px;height:2px;background:{{color.text}};opacity:.15;border-radius:1px;}
      .min-card__bottom{font-size:clamp(11px,1.4vw,15px);color:{{color.text}};opacity:.45;letter-spacing:.08em;font-style:italic;}
    </style>
    <div class="min-card">
      <div class="min-card__top">{{text.top}}</div>
      <h1 class="min-card__main">{{text.main}}</h1>
      <div class="min-card__line"></div>
      <div class="min-card__bottom">{{text.bottom}}</div>
    </div>`
  ),
];
