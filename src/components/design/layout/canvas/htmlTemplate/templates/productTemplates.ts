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

  createTemplate(
    {
      id: "excel-shortcuts-mat",
      name: "Excel 快捷键鼠标垫",
      description: "Excel 常用快捷键速查表，直接做鼠标垫/桌垫印花，程序员和办公族必备。",
      tags: ["Excel", "快捷键", "鼠标垫", "办公", "程序员"],
      sortOrder: 200,
    },
    [
      textField("text.title", "标题", "EXCEL SHORTCUTS"),
      colorField("color.bg", "背景色"),
      colorField("color.header", "标题栏色"),
      colorField("color.accent", "高亮色"),
      colorField("color.row1", "奇数行色"),
      colorField("color.row2", "偶数行色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "EXCEL SHORTCUTS" },
      color: {
        bg: createPureColor("#f0fdf4"),
        header: createPureColor("#166534"),
        accent: createPureColor("#22c55e"),
        row1: createPureColor("#ffffff"),
        row2: createPureColor("#f0fdf4"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .xlm{width:100%;height:100%;background:{{color.bg}};padding:4%;box-sizing:border-box;font-family:'SF Mono',Consolas,'Courier New',monospace;display:flex;flex-direction:column;}
      .xlm__head{background:{{color.header}};color:#fff;padding:clamp(8px,1.5vw,16px) clamp(12px,2vw,20px);border-radius:clamp(6px,1vw,10px) clamp(6px,1vw,10px) 0 0;font-size:clamp(14px,2vw,22px);font-weight:800;letter-spacing:.15em;text-align:center;font-family:{{font.title.family}},sans-serif;}
      .xlm__body{flex:1;border:2px solid {{color.header}};border-top:none;border-radius:0 0 clamp(6px,1vw,10px) clamp(6px,1vw,10px);overflow:hidden;}
      .xlm__grid{display:grid;grid-template-columns:1fr 1fr;height:100%;}
      .xlm__col{display:flex;flex-direction:column;}
      .xlm__row{display:flex;align-items:center;padding:clamp(4px,.8vw,8px) clamp(8px,1.2vw,14px);gap:clamp(6px,1vw,12px);border-bottom:1px solid rgba(0,0,0,.06);flex:1;}
      .xlm__row:nth-child(odd){background:{{color.row1}};}
      .xlm__row:nth-child(even){background:{{color.row2}};}
      .xlm__key{background:{{color.accent}};color:#fff;padding:clamp(2px,.4vw,4px) clamp(6px,.8vw,10px);border-radius:4px;font-size:clamp(8px,1vw,11px);font-weight:700;white-space:nowrap;flex-shrink:0;}
      .xlm__fn{font-size:clamp(8px,1vw,11px);color:#334155;line-height:1.3;}
    </style>
    <div class="xlm">
      <div class="xlm__head">{{text.title}}</div>
      <div class="xlm__body">
        <div class="xlm__grid">
          <div class="xlm__col">
            <div class="xlm__row"><span class="xlm__key">Ctrl+C</span><span class="xlm__fn">复制</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+V</span><span class="xlm__fn">粘贴</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+Z</span><span class="xlm__fn">撤销</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+S</span><span class="xlm__fn">保存</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+A</span><span class="xlm__fn">全选</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+F</span><span class="xlm__fn">查找</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+H</span><span class="xlm__fn">替换</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+B</span><span class="xlm__fn">加粗</span></div>
          </div>
          <div class="xlm__col">
            <div class="xlm__row"><span class="xlm__key">Ctrl+X</span><span class="xlm__fn">剪切</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+D</span><span class="xlm__fn">向下填充</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+R</span><span class="xlm__fn">向右填充</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+;</span><span class="xlm__fn">插入日期</span></div>
            <div class="xlm__row"><span class="xlm__key">F2</span><span class="xlm__fn">编辑单元格</span></div>
            <div class="xlm__row"><span class="xlm__key">F4</span><span class="xlm__fn">重复操作</span></div>
            <div class="xlm__row"><span class="xlm__key">Alt+=</span><span class="xlm__fn">自动求和</span></div>
            <div class="xlm__row"><span class="xlm__key">Ctrl+1</span><span class="xlm__fn">设置格式</span></div>
          </div>
        </div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "periodic-table-poster",
      name: "元素周期表海报",
      description: "化学元素周期表，适合海报、鼠标垫、T恤印花，科学爱好者最爱。",
      tags: ["化学", "元素周期表", "科学", "教育", "海报"],
      sortOrder: 210,
    },
    [
      textField("text.title", "标题", "PERIODIC TABLE"),
      textField("text.sub", "副标题", "OF THE ELEMENTS"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "主色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "PERIODIC TABLE", sub: "OF THE ELEMENTS" },
      color: {
        bg: createPureColor("#0c0a09"),
        accent: createPureColor("#fafaf9"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .pt{width:100%;height:100%;background:{{color.bg}};padding:4%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:clamp(6px,1vw,12px);font-family:{{font.title.family}},sans-serif;overflow:hidden;}
      .pt__head{text-align:center;}
      .pt__title{font-size:clamp(16px,3vw,36px);font-weight:900;color:{{color.accent}};letter-spacing:.15em;margin:0;}
      .pt__sub{font-size:clamp(8px,1.2vw,12px);color:{{color.accent}};opacity:.4;letter-spacing:.3em;}
      .pt__grid{display:grid;grid-template-columns:repeat(9,1fr);gap:clamp(2px,.4vw,4px);width:100%;flex:1;align-content:start;}
      .pt__el{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:clamp(3px,.5vw,6px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(2px,.4vw,4px);gap:1px;}
      .pt__num{font-size:clamp(5px,.7vw,8px);color:rgba(255,255,255,.35);}
      .pt__sym{font-size:clamp(10px,1.5vw,18px);font-weight:800;color:{{color.accent}};line-height:1;}
      .pt__name{font-size:clamp(4px,.6vw,7px);color:rgba(255,255,255,.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
      .pt__el--highlight{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.25);}
    </style>
    <div class="pt">
      <div class="pt__head">
        <h1 class="pt__title">{{text.title}}</h1>
        <div class="pt__sub">{{text.sub}}</div>
      </div>
      <div class="pt__grid">
        <div class="pt__el pt__el--highlight"><span class="pt__num">1</span><span class="pt__sym">H</span><span class="pt__name">Hydrogen</span></div>
        <div class="pt__el"><span class="pt__num">2</span><span class="pt__sym">He</span><span class="pt__name">Helium</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">3</span><span class="pt__sym">Li</span><span class="pt__name">Lithium</span></div>
        <div class="pt__el"><span class="pt__num">4</span><span class="pt__sym">Be</span><span class="pt__name">Beryllium</span></div>
        <div class="pt__el"><span class="pt__num">5</span><span class="pt__sym">B</span><span class="pt__name">Boron</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">6</span><span class="pt__sym">C</span><span class="pt__name">Carbon</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">7</span><span class="pt__sym">N</span><span class="pt__name">Nitrogen</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">8</span><span class="pt__sym">O</span><span class="pt__name">Oxygen</span></div>
        <div class="pt__el"><span class="pt__num">9</span><span class="pt__sym">F</span><span class="pt__name">Fluorine</span></div>
        <div class="pt__el"><span class="pt__num">10</span><span class="pt__sym">Ne</span><span class="pt__name">Neon</span></div>
        <div class="pt__el"><span class="pt__num">11</span><span class="pt__sym">Na</span><span class="pt__name">Sodium</span></div>
        <div class="pt__el"><span class="pt__num">12</span><span class="pt__sym">Mg</span><span class="pt__name">Magnesium</span></div>
        <div class="pt__el"><span class="pt__num">13</span><span class="pt__sym">Al</span><span class="pt__name">Aluminium</span></div>
        <div class="pt__el"><span class="pt__num">14</span><span class="pt__sym">Si</span><span class="pt__name">Silicon</span></div>
        <div class="pt__el"><span class="pt__num">15</span><span class="pt__sym">P</span><span class="pt__name">Phosphorus</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">16</span><span class="pt__sym">S</span><span class="pt__name">Sulfur</span></div>
        <div class="pt__el"><span class="pt__num">17</span><span class="pt__sym">Cl</span><span class="pt__name">Chlorine</span></div>
        <div class="pt__el"><span class="pt__num">18</span><span class="pt__sym">Ar</span><span class="pt__name">Argon</span></div>
        <div class="pt__el"><span class="pt__num">19</span><span class="pt__sym">K</span><span class="pt__name">Potassium</span></div>
        <div class="pt__el"><span class="pt__num">20</span><span class="pt__sym">Ca</span><span class="pt__name">Calcium</span></div>
        <div class="pt__el"><span class="pt__num">21</span><span class="pt__sym">Sc</span><span class="pt__name">Scandium</span></div>
        <div class="pt__el"><span class="pt__num">22</span><span class="pt__sym">Ti</span><span class="pt__name">Titanium</span></div>
        <div class="pt__el"><span class="pt__num">23</span><span class="pt__sym">V</span><span class="pt__name">Vanadium</span></div>
        <div class="pt__el"><span class="pt__num">24</span><span class="pt__sym">Cr</span><span class="pt__name">Chromium</span></div>
        <div class="pt__el"><span class="pt__num">25</span><span class="pt__sym">Mn</span><span class="pt__name">Manganese</span></div>
        <div class="pt__el pt__el--highlight"><span class="pt__num">26</span><span class="pt__sym">Fe</span><span class="pt__name">Iron</span></div>
        <div class="pt__el"><span class="pt__num">27</span><span class="pt__sym">Co</span><span class="pt__name">Cobalt</span></div>
        <div class="pt__el"><span class="pt__num">28</span><span class="pt__sym">Ni</span><span class="pt__name">Nickel</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "stock-terms-mat",
      name: "股票术语鼠标垫",
      description: "股票交易常用术语速查，适合股民和金融爱好者桌垫、海报印花。",
      tags: ["股票", "金融", "投资", "术语", "鼠标垫"],
      sortOrder: 220,
    },
    [
      textField("text.title", "标题", "STOCK MARKET"),
      textField("text.sub", "副标题", "ESSENTIAL TERMS"),
      colorField("color.bg", "背景色"),
      colorField("color.card", "卡片色"),
      colorField("color.up", "涨色"),
      colorField("color.down", "跌色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "STOCK MARKET", sub: "ESSENTIAL TERMS" },
      color: {
        bg: createPureColor("#0f172a"),
        card: createPureColor("rgba(255,255,255,.06)"),
        up: createPureColor("#22c55e"),
        down: createPureColor("#ef4444"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .stk{width:100%;height:100%;background:{{color.bg}};padding:5%;box-sizing:border-box;display:flex;flex-direction:column;gap:clamp(8px,1.2vw,14px);font-family:{{font.title.family}},sans-serif;overflow:hidden;}
      .stk__head{text-align:center;}
      .stk__title{font-size:clamp(18px,3.5vw,40px);font-weight:900;color:#f8fafc;letter-spacing:.15em;margin:0;}
      .stk__sub{font-size:clamp(8px,1vw,11px);color:rgba(255,255,255,.35);letter-spacing:.3em;}
      .stk__grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(4px,.6vw,8px);flex:1;align-content:start;}
      .stk__item{background:{{color.card}};border:1px solid rgba(255,255,255,.08);border-radius:clamp(6px,1vw,10px);padding:clamp(6px,1vw,12px);display:flex;flex-direction:column;gap:clamp(2px,.3vw,4px);}
      .stk__term{font-size:clamp(10px,1.4vw,16px);font-weight:800;color:#f8fafc;letter-spacing:.05em;}
      .stk__desc{font-size:clamp(7px,.9vw,10px);color:rgba(255,255,255,.5);line-height:1.4;}
      .stk__badge{display:inline-flex;align-self:flex-start;padding:clamp(1px,.2vw,2px) clamp(4px,.6vw,8px);border-radius:4px;font-size:clamp(5px,.7vw,8px);font-weight:700;margin-top:2px;}
      .stk__badge--up{background:rgba(34,197,94,.15);color:{{color.up}};}
      .stk__badge--down{background:rgba(239,68,68,.15);color:{{color.down}};}
      .stk__badge--neu{background:rgba(255,255,255,.08);color:rgba(255,255,255,.4);}
    </style>
    <div class="stk">
      <div class="stk__head">
        <h1 class="stk__title">{{text.title}}</h1>
        <div class="stk__sub">{{text.sub}}</div>
      </div>
      <div class="stk__grid">
        <div class="stk__item"><span class="stk__term">牛市 Bull</span><span class="stk__desc">市场持续上涨</span><span class="stk__badge stk__badge--up">↑ UP</span></div>
        <div class="stk__item"><span class="stk__term">熊市 Bear</span><span class="stk__desc">市场持续下跌</span><span class="stk__badge stk__badge--down">↓ DOWN</span></div>
        <div class="stk__item"><span class="stk__term">涨停 Limit Up</span><span class="stk__desc">当日涨幅达上限</span><span class="stk__badge stk__badge--up">+10%</span></div>
        <div class="stk__item"><span class="stk__term">跌停 Limit Down</span><span class="stk__desc">当日跌幅达下限</span><span class="stk__badge stk__badge--down">-10%</span></div>
        <div class="stk__item"><span class="stk__term">K线 Candlestick</span><span class="stk__desc">记录价格走势</span><span class="stk__badge stk__badge--neu">CHART</span></div>
        <div class="stk__item"><span class="stk__term">成交量 Volume</span><span class="stk__desc">买卖交易数量</span><span class="stk__badge stk__badge--neu">QTY</span></div>
        <div class="stk__item"><span class="stk__term">多头 Long</span><span class="stk__desc">看好后市买入</span><span class="stk__badge stk__badge--up">BUY</span></div>
        <div class="stk__item"><span class="stk__term">空头 Short</span><span class="stk__desc">看空后市卖出</span><span class="stk__badge stk__badge--down">SELL</span></div>
        <div class="stk__item"><span class="stk__term">PE 市盈率</span><span class="stk__desc">股价/每股收益</span><span class="stk__badge stk__badge--neu">RATIO</span></div>
        <div class="stk__item"><span class="stk__term">MACD</span><span class="stk__desc">趋势跟踪指标</span><span class="stk__badge stk__badge--neu">IND</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "git-commands-dev",
      name: "Git 命令速查",
      description: "Git 常用命令速查表，程序员鼠标垫、T恤、贴纸印花首选。",
      tags: ["Git", "程序员", "开发者", "命令行", "鼠标垫"],
      sortOrder: 230,
    },
    [
      textField("text.title", "标题", "GIT COMMANDS"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "GIT COMMANDS" },
      color: {
        bg: createPureColor("#1e1b4b"),
        accent: createPureColor("#818cf8"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .gitm{width:100%;height:100%;background:{{color.bg}};padding:4%;box-sizing:border-box;font-family:'SF Mono',Consolas,'Courier New',monospace;display:flex;flex-direction:column;overflow:hidden;}
      .gitm__head{text-align:center;margin-bottom:clamp(6px,1vw,12px);}
      .gitm__title{font-size:clamp(16px,3vw,36px);font-weight:900;color:{{color.accent}};letter-spacing:.15em;margin:0;font-family:{{font.title.family}},sans-serif;}
      .gitm__body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:clamp(4px,.6vw,8px);align-content:start;}
      .gitm__item{display:flex;align-items:center;gap:clamp(6px,1vw,14px);padding:clamp(5px,.8vw,10px) clamp(8px,1.2vw,14px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:clamp(4px,.6vw,8px);}
      .gitm__cmd{color:{{color.accent}};font-size:clamp(8px,1.1vw,12px);font-weight:700;white-space:nowrap;flex-shrink:0;}
      .gitm__desc{color:rgba(255,255,255,.45);font-size:clamp(7px,.9vw,10px);line-height:1.3;}
    </style>
    <div class="gitm">
      <div class="gitm__head"><h1 class="gitm__title">{{text.title}}</h1></div>
      <div class="gitm__body">
        <div class="gitm__item"><span class="gitm__cmd">git init</span><span class="gitm__desc">初始化仓库</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git clone</span><span class="gitm__desc">克隆远程仓库</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git add .</span><span class="gitm__desc">暂存所有更改</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git commit</span><span class="gitm__desc">提交更改</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git push</span><span class="gitm__desc">推送到远程</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git pull</span><span class="gitm__desc">拉取远程更新</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git branch</span><span class="gitm__desc">分支管理</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git checkout</span><span class="gitm__desc">切换分支</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git merge</span><span class="gitm__desc">合并分支</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git stash</span><span class="gitm__desc">暂存工作区</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git rebase</span><span class="gitm__desc">变基操作</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git log</span><span class="gitm__desc">查看提交历史</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git diff</span><span class="gitm__desc">查看差异</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git reset</span><span class="gitm__desc">重置 HEAD</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git tag</span><span class="gitm__desc">标签管理</span></div>
        <div class="gitm__item"><span class="gitm__cmd">git remote</span><span class="gitm__desc">远程仓库管理</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "typography-poster",
      name: "字母排版海报",
      description: "大写字母艺术排版，适合海报、帆布袋、T恤后背等大面积印花。",
      tags: ["排版", "字母", "海报", "艺术", "极简"],
      sortOrder: 240,
    },
    [
      textField("text.letter", "字母", "A"),
      textField("text.word", "单词", "ART"),
      textField("text.sub", "描述", "Aesthetic · Refined · Timeless"),
      colorField("color.bg", "背景色"),
      colorField("color.letter", "字母色"),
      colorField("color.accent", "强调色"),
      fontField("font.letter", "字母字体"),
    ],
    {
      text: { letter: "A", word: "ART", sub: "Aesthetic · Refined · Timeless" },
      color: {
        bg: createPureColor("#fef3c7"),
        letter: createPureColor("#92400e"),
        accent: createPureColor("#d97706"),
      },
      font: { letter: defaultFontBinding },
    },
    `<style>
      .typo{width:100%;height:100%;background:{{color.bg}};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
      .typo__bg{position:absolute;font-size:clamp(200px,50vw,600px);font-weight:900;color:{{color.letter}};opacity:.06;line-height:.8;font-family:{{font.letter.family}},sans-serif;right:-5%;bottom:-10%;}
      .typo__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:flex-start;padding:8%;gap:clamp(8px,1.5vw,16px);}
      .typo__word{font-size:clamp(48px,12vw,140px);font-weight:900;color:{{color.letter}};letter-spacing:-.03em;line-height:.85;font-family:{{font.letter.family}},sans-serif;}
      .typo__line{width:clamp(40px,8vw,80px);height:3px;background:{{color.accent}};border-radius:2px;}
      .typo__sub{font-size:clamp(10px,1.5vw,16px);color:{{color.letter}};opacity:.5;letter-spacing:.08em;}
    </style>
    <div class="typo">
      <div class="typo__bg">{{text.letter}}</div>
      <div class="typo__content">
        <h1 class="typo__word">{{text.word}}</h1>
        <div class="typo__line"></div>
        <div class="typo__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "keyboard-layout-mat",
      name: "键盘布局鼠标垫",
      description: "标准键盘键位布局图，适合键盘爱好者、程序员鼠标垫印花。",
      tags: ["键盘", "键位", "程序员", "鼠标垫", "机械键盘"],
      sortOrder: 250,
    },
    [
      textField("text.title", "标题", "KEYBOARD LAYOUT"),
      colorField("color.bg", "背景色"),
      colorField("color.key", "键帽色"),
      colorField("color.accent", "高亮色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "KEYBOARD LAYOUT" },
      color: {
        bg: createPureColor("#18181b"),
        key: createPureColor("rgba(255,255,255,.08)"),
        accent: createPureColor("#a78bfa"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .kb{width:100%;height:100%;background:{{color.bg}};padding:4%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.2vw,14px);font-family:{{font.title.family}},sans-serif;overflow:hidden;}
      .kb__title{font-size:clamp(14px,2.5vw,28px);font-weight:900;color:{{color.accent}};letter-spacing:.15em;}
      .kb__board{width:100%;flex:1;display:flex;flex-direction:column;gap:clamp(3px,.4vw,5px);align-content:start;}
      .kb__row{display:flex;gap:clamp(2px,.3vw,4px);flex:1;}
      .kb__key{flex:1;background:{{color.key}};border:1px solid rgba(255,255,255,.06);border-radius:clamp(3px,.5vw,6px);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.6);font-size:clamp(7px,1vw,12px);font-weight:600;}
      .kb__key--wide{flex:1.5;}
      .kb__key--space{flex:6;}
      .kb__key--highlight{background:rgba(167,139,250,.15);border-color:{{color.accent}};color:{{color.accent}};}
    </style>
    <div class="kb">
      <h1 class="kb__title">{{text.title}}</h1>
      <div class="kb__board">
        <div class="kb__row"><span class="kb__key kb__key--highlight">Esc</span><span class="kb__key">F1</span><span class="kb__key">F2</span><span class="kb__key">F3</span><span class="kb__key">F4</span><span class="kb__key">F5</span><span class="kb__key">F6</span><span class="kb__key">F7</span><span class="kb__key">F8</span><span class="kb__key">F9</span><span class="kb__key">F10</span><span class="kb__key">F11</span><span class="kb__key">F12</span></div>
        <div class="kb__row"><span class="kb__key">~</span><span class="kb__key">1</span><span class="kb__key">2</span><span class="kb__key">3</span><span class="kb__key">4</span><span class="kb__key">5</span><span class="kb__key">6</span><span class="kb__key">7</span><span class="kb__key">8</span><span class="kb__key">9</span><span class="kb__key">0</span><span class="kb__key">-</span><span class="kb__key">=</span><span class="kb__key kb__key--wide">Bksp</span></div>
        <div class="kb__row"><span class="kb__key kb__key--wide">Tab</span><span class="kb__key">Q</span><span class="kb__key">W</span><span class="kb__key">E</span><span class="kb__key">R</span><span class="kb__key">T</span><span class="kb__key">Y</span><span class="kb__key">U</span><span class="kb__key">I</span><span class="kb__key">O</span><span class="kb__key">P</span><span class="kb__key">[</span><span class="kb__key">]</span><span class="kb__key">\\</span></div>
        <div class="kb__row"><span class="kb__key kb__key--wide kb__key--highlight">Caps</span><span class="kb__key">A</span><span class="kb__key">S</span><span class="kb__key">D</span><span class="kb__key">F</span><span class="kb__key kb__key--highlight">G</span><span class="kb__key">H</span><span class="kb__key">J</span><span class="kb__key">K</span><span class="kb__key">L</span><span class="kb__key">;</span><span class="kb__key">'</span><span class="kb__key kb__key--wide">Enter</span></div>
        <div class="kb__row"><span class="kb__key kb__key--wide">Shift</span><span class="kb__key">Z</span><span class="kb__key">X</span><span class="kb__key">C</span><span class="kb__key">V</span><span class="kb__key">B</span><span class="kb__key">N</span><span class="kb__key">M</span><span class="kb__key">,</span><span class="kb__key">.</span><span class="kb__key">/</span><span class="kb__key kb__key--wide">Shift</span></div>
        <div class="kb__row"><span class="kb__key">Ctrl</span><span class="kb__key">Win</span><span class="kb__key">Alt</span><span class="kb__key kb__key--space">Space</span><span class="kb__key">Alt</span><span class="kb__key">Fn</span><span class="kb__key">Menu</span><span class="kb__key">Ctrl</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "css-cheat-sheet",
      name: "CSS 属性速查",
      description: "CSS 常用属性速查表，前端开发者鼠标垫、海报印花。",
      tags: ["CSS", "前端", "开发者", "程序员", "鼠标垫"],
      sortOrder: 260,
    },
    [
      textField("text.title", "标题", "CSS PROPERTIES"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "CSS PROPERTIES" },
      color: {
        bg: createPureColor("#fdf4ff"),
        accent: createPureColor("#a855f7"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .cssm{width:100%;height:100%;background:{{color.bg}};padding:4%;box-sizing:border-box;font-family:'SF Mono',Consolas,'Courier New',monospace;display:flex;flex-direction:column;overflow:hidden;}
      .cssm__head{text-align:center;margin-bottom:clamp(6px,1vw,12px);}
      .cssm__title{font-size:clamp(16px,3vw,32px);font-weight:900;color:{{color.accent}};letter-spacing:.12em;margin:0;font-family:{{font.title.family}},sans-serif;}
      .cssm__body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:clamp(4px,.6vw,8px);align-content:start;}
      .cssm__item{display:flex;align-items:center;gap:clamp(6px,1vw,12px);padding:clamp(5px,.8vw,10px);background:#fff;border:1px solid rgba(168,85,247,.1);border-radius:clamp(4px,.6vw,8px);}
      .cssm__prop{color:{{color.accent}};font-size:clamp(8px,1.1vw,12px);font-weight:700;white-space:nowrap;flex-shrink:0;}
      .cssm__val{color:#6b7280;font-size:clamp(7px,.9vw,10px);}
    </style>
    <div class="cssm">
      <div class="cssm__head"><h1 class="cssm__title">{{text.title}}</h1></div>
      <div class="cssm__body">
        <div class="cssm__item"><span class="cssm__prop">display</span><span class="cssm__val">flex | grid | block</span></div>
        <div class="cssm__item"><span class="cssm__prop">position</span><span class="cssm__val">absolute | relative</span></div>
        <div class="cssm__item"><span class="cssm__prop">margin</span><span class="cssm__val">0 auto | 10px 20px</span></div>
        <div class="cssm__item"><span class="cssm__prop">padding</span><span class="cssm__val">1rem | 10px 20px</span></div>
        <div class="cssm__item"><span class="cssm__prop">border-radius</span><span class="cssm__val">50% | 8px</span></div>
        <div class="cssm__item"><span class="cssm__prop">box-shadow</span><span class="cssm__val">0 4px 6px rgba()</span></div>
        <div class="cssm__item"><span class="cssm__prop">transform</span><span class="cssm__val">rotate() scale()</span></div>
        <div class="cssm__item"><span class="cssm__prop">transition</span><span class="cssm__val">all .3s ease</span></div>
        <div class="cssm__item"><span class="cssm__prop">overflow</span><span class="cssm__val">hidden | scroll</span></div>
        <div class="cssm__item"><span class="cssm__prop">z-index</span><span class="cssm__val">999 | -1</span></div>
        <div class="cssm__item"><span class="cssm__prop">opacity</span><span class="cssm__val">0 | 0.5 | 1</span></div>
        <div class="cssm__item"><span class="cssm__prop">cursor</span><span class="cssm__val">pointer | grab</span></div>
        <div class="cssm__item"><span class="cssm__prop">flex-wrap</span><span class="cssm__val">wrap | nowrap</span></div>
        <div class="cssm__item"><span class="cssm__prop">gap</span><span class="cssm__val">8px | 1rem</span></div>
        <div class="cssm__item"><span class="cssm__prop">object-fit</span><span class="cssm__val">cover | contain</span></div>
        <div class="cssm__item"><span class="cssm__prop">filter</span><span class="cssm__val">blur() brightness()</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "math-formulas-poster",
      name: "数学公式海报",
      description: "经典数学公式集合，适合理科爱好者海报、鼠标垫、T恤印花。",
      tags: ["数学", "公式", "科学", "教育", "海报"],
      sortOrder: 270,
    },
    [
      textField("text.title", "标题", "MATHEMATICS"),
      textField("text.sub", "副标题", "The Language of the Universe"),
      colorField("color.bg", "背景色"),
      colorField("color.text", "文字色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "MATHEMATICS", sub: "The Language of the Universe" },
      color: {
        bg: createPureColor("#0f172a"),
        text: createPureColor("#e2e8f0"),
        accent: createPureColor("#38bdf8"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .math{width:100%;height:100%;background:{{color.bg}};padding:5%;box-sizing:border-box;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(12px,2vw,24px);font-family:{{font.title.family}},sans-serif;text-align:center;position:relative;overflow:hidden;}
      .math::before{content:"e=mc²";position:absolute;font-size:clamp(80px,25vw,300px);font-weight:900;color:rgba(255,255,255,.02);line-height:1;}
      .math__title{font-size:clamp(20px,4vw,48px);font-weight:900;color:{{color.accent}};letter-spacing:.15em;margin:0;position:relative;}
      .math__sub{font-size:clamp(10px,1.4vw,14px);color:{{color.text}};opacity:.4;letter-spacing:.1em;position:relative;}
      .math__list{display:flex;flex-direction:column;gap:clamp(8px,1.2vw,16px);position:relative;}
      .math__item{display:flex;align-items:center;gap:clamp(12px,2vw,24px);padding:clamp(8px,1.5vw,16px);background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:clamp(6px,1vw,10px);}
      .math__formula{font-size:clamp(16px,3vw,36px);font-weight:700;color:{{color.accent}};font-style:italic;white-space:nowrap;}
      .math__name{font-size:clamp(10px,1.4vw,14px);color:{{color.text}};opacity:.5;text-align:left;}
    </style>
    <div class="math">
      <h1 class="math__title">{{text.title}}</h1>
      <div class="math__sub">{{text.sub}}</div>
      <div class="math__list">
        <div class="math__item"><span class="math__formula">E = mc²</span><span class="math__name">质能方程<br/>Einstein, 1905</span></div>
        <div class="math__item"><span class="math__formula">a² + b² = c²</span><span class="math__name">勾股定理<br/>Pythagoras</span></div>
        <div class="math__item"><span class="math__formula">e<sup>iπ</sup> + 1 = 0</span><span class="math__name">欧拉公式<br/>Euler's Identity</span></div>
        <div class="math__item"><span class="math__formula">F = ma</span><span class="math__name">牛顿第二定律<br/>Newton, 1687</span></div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "ascii-art-header",
      name: "ASCII 艺术标题",
      description: "用 ASCII 字符拼出大标题，程序员风格海报、鼠标垫、T恤印花。",
      tags: ["ASCII", "程序员", "代码", "复古", "鼠标垫"],
      sortOrder: 280,
    },
    [
      textareaField("text.ascii", "ASCII 内容", " ____  _  _  ____ \n(  _ \\( \\/ )/ ___)\n ) __/ )  / \\___ \\n(__)  (__/  (____/", 6),
      textField("text.sub", "底部文字", "// coded with passion"),
      colorField("color.bg", "背景色"),
      colorField("color.text", "文字色"),
    ],
    {
      text: {
        ascii: " ____  _  _  ____ \n(  _ \\( \\/ )/ ___)\n ) __/ )  / \\___ \\n(__)  (__/  (____/",
        sub: "// coded with passion",
      },
      color: {
        bg: createPureColor("#0d1117"),
        text: createPureColor("#58a6ff"),
      },
    },
    `<style>
      .ascii{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8%;box-sizing:border-box;gap:clamp(12px,2vw,20px);font-family:'SF Mono',Consolas,'Courier New',monospace;}
      .ascii__art{font-size:clamp(10px,2.2vw,28px);color:{{color.text}};white-space:pre;line-height:1.15;text-align:center;letter-spacing:0;}
      .ascii__sub{font-size:clamp(10px,1.4vw,14px);color:{{color.text}};opacity:.35;}
    </style>
    <div class="ascii">
      <pre class="ascii__art">{{text.ascii}}</pre>
      <div class="ascii__sub">{{text.sub}}</div>
    </div>`
  ),
];
