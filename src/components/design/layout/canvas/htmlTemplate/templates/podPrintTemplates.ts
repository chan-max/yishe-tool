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

export const podPrintTemplates: HtmlTemplateDefinition[] = [
  // ─────────────────────────────────────────────
  // 现代简约 · Modern Minimalist
  // ─────────────────────────────────────────────

  createTemplate(
    {
      id: "pod-geometric-brand-tee",
      name: "几何品牌T恤印花",
      category: "现代简约",
      description: "几何色块 + 大字品牌名，适合 T 恤前胸小图或后背大图印花，干净利落。",
      tags: ["T恤", "几何", "品牌", "极简", "印花"],
      sortOrder: 500,
    },
    [
      textField("text.brand", "品牌名", "FORMA"),
      textField("text.year", "年份", "2026"),
      colorField("color.bg", "背景色"),
      colorField("color.block1", "色块1"),
      colorField("color.block2", "色块2"),
      colorField("color.text", "文字色"),
      fontField("font.brand", "品牌字体"),
    ],
    {
      text: { brand: "FORMA", year: "2026" },
      color: {
        bg: createPureColor("#f5f5f4"),
        block1: createPureColor("#1c1917"),
        block2: createPureColor("#a8a29e"),
        text: createPureColor("#1c1917"),
      },
      font: { brand: defaultFontBinding },
    },
    `<style>
      .geo-brand{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10%;box-sizing:border-box;position:relative;overflow:hidden;}
      .geo-brand__shapes{position:absolute;inset:0;pointer-events:none;}
      .geo-brand__rect1{position:absolute;width:28%;height:42%;top:8%;left:6%;background:{{color.block1}};opacity:.08;}
      .geo-brand__rect2{position:absolute;width:20%;height:20%;bottom:12%;right:8%;background:{{color.block2}};opacity:.12;border-radius:50%;}
      .geo-brand__rect3{position:absolute;width:40%;height:3px;top:50%;left:30%;background:{{color.block1}};opacity:.06;}
      .geo-brand__circle{position:absolute;width:14%;aspect-ratio:1/1;border:3px solid {{color.block1}};border-radius:50%;top:18%;right:14%;opacity:.1;}
      .geo-brand__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(8px,1.5vw,16px);}
      .geo-brand__brand{font-size:clamp(48px,10vw,120px);font-weight:900;letter-spacing:.12em;color:{{color.text}};line-height:.9;font-family:{{font.brand.family}},sans-serif;}
      .geo-brand__bar{width:clamp(48px,8vw,96px);height:4px;background:{{color.block1}};border-radius:2px;}
      .geo-brand__year{font-size:clamp(11px,1.4vw,14px);letter-spacing:.4em;color:{{color.text}};opacity:.4;}
    </style>
    <div class="geo-brand">
      <div class="geo-brand__shapes">
        <div class="geo-brand__rect1"></div>
        <div class="geo-brand__rect2"></div>
        <div class="geo-brand__rect3"></div>
        <div class="geo-brand__circle"></div>
      </div>
      <div class="geo-brand__content">
        <div class="geo-brand__brand">{{text.brand}}</div>
        <div class="geo-brand__bar"></div>
        <div class="geo-brand__year">{{text.year}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-swiss-grid-layout",
      name: "瑞士网格排版海报",
      category: "现代简约",
      description: "受国际主义风格启发的网格排版，适合海报、帆布袋、T恤后背等大面积印花。",
      tags: ["海报", "排版", "瑞士风格", "网格", "帆布袋"],
      sortOrder: 510,
    },
    [
      textField("text.title", "主标题", "DESIGN"),
      textField("text.sub", "副标题", "System"),
      textareaField("text.body", "正文", "Form follows function. Simplicity is the ultimate sophistication.", 3),
      textField("text.tag", "标签", "VOL.03"),
      colorField("color.bg", "背景色"),
      colorField("color.accent", "强调色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: {
        title: "DESIGN",
        sub: "System",
        body: "Form follows function. Simplicity is the ultimate sophistication.",
        tag: "VOL.03",
      },
      color: {
        bg: createPureColor("#ffffff"),
        accent: createPureColor("#dc2626"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .swiss{width:100%;height:100%;background:{{color.bg}};display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr auto;padding:6%;box-sizing:border-box;gap:clamp(8px,1.5vw,16px);font-family:{{font.title.family}},sans-serif;position:relative;overflow:hidden;}
      .swiss__tag{grid-column:1/3;display:flex;justify-content:space-between;align-items:center;padding-bottom:clamp(8px,1.2vw,14px);border-bottom:2px solid #0f172a;}
      .swiss__tag-text{font-size:clamp(10px,1.2vw,12px);letter-spacing:.3em;color:#64748b;text-transform:uppercase;}
      .swiss__tag-dot{width:clamp(8px,1.2vw,12px);aspect-ratio:1/1;border-radius:50%;background:{{color.accent}};}
      .swiss__left{display:flex;flex-direction:column;justify-content:center;gap:clamp(6px,1vw,12px);padding-right:8%;}
      .swiss__title{font-size:clamp(48px,10vw,120px);font-weight:900;letter-spacing:-.04em;line-height:.85;color:#0f172a;}
      .swiss__sub{font-size:clamp(24px,5vw,60px);font-weight:300;color:#94a3b8;letter-spacing:.02em;}
      .swiss__right{display:flex;flex-direction:column;justify-content:flex-end;padding-left:8%;border-left:1px solid #e2e8f0;}
      .swiss__body{font-size:clamp(11px,1.4vw,14px);line-height:1.8;color:#475569;}
      .swiss__footer{grid-column:1/3;display:flex;align-items:center;gap:clamp(8px,1.5vw,16px);padding-top:clamp(8px,1.2vw,14px);border-top:2px solid #0f172a;}
      .swiss__footer-bar{flex:1;height:clamp(3px,.5vw,4px);background:{{color.accent}};}
      .swiss__footer-text{font-size:clamp(10px,1.2vw,12px);letter-spacing:.2em;color:#64748b;text-transform:uppercase;}
    </style>
    <div class="swiss">
      <div class="swiss__tag">
        <span class="swiss__tag-text">{{text.tag}}</span>
        <div class="swiss__tag-dot"></div>
      </div>
      <div class="swiss__left">
        <h1 class="swiss__title">{{text.title}}</h1>
        <div class="swiss__sub">{{text.sub}}</div>
      </div>
      <div class="swiss__right">
        <p class="swiss__body">{{text.body}}</p>
      </div>
      <div class="swiss__footer">
        <div class="swiss__footer-bar"></div>
        <span class="swiss__footer-text">Swiss Typography</span>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-minimal-line-art",
      name: "极简线条艺术印花",
      category: "现代简约",
      description: "手绘线条与大字排版结合，适合 T 恤、帆布袋、手机壳等 POD 商品。",
      tags: ["线条", "极简", "艺术", "T恤", "手绘"],
      sortOrder: 520,
    },
    [
      textField("text.word", "主词", "BREATHE"),
      textField("text.sub", "副词", "inhale · exhale · repeat"),
      colorField("color.bg", "背景色"),
      colorField("color.line", "线条色"),
      colorField("color.text", "文字色"),
      fontField("font.word", "主词字体"),
    ],
    {
      text: { word: "BREATHE", sub: "inhale · exhale · repeat" },
      color: {
        bg: createPureColor("#fafaf9"),
        line: createPureColor("#57534e"),
        text: createPureColor("#1c1917"),
      },
      font: { word: defaultFontBinding },
    },
    `<style>
      .line-art{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10%;box-sizing:border-box;position:relative;overflow:hidden;}
      .line-art__svg{position:absolute;inset:0;width:100%;height:100%;}
      .line-art__svg svg{width:100%;height:100%;}
      .line-art__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(12px,2vw,24px);}
      .line-art__word{font-size:clamp(40px,9vw,110px);font-weight:900;letter-spacing:.08em;color:{{color.text}};line-height:.9;font-family:{{font.word.family}},sans-serif;}
      .line-art__line{width:clamp(60px,12vw,140px);height:2px;background:{{color.line}};opacity:.35;}
      .line-art__sub{font-size:clamp(11px,1.5vw,15px);letter-spacing:.12em;color:{{color.line}};opacity:.6;}
    </style>
    <div class="line-art">
      <div class="line-art__svg">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="400" cy="400" r="280" stroke="{{color.line}}" stroke-width="1" opacity=".08"/>
          <circle cx="400" cy="400" r="220" stroke="{{color.line}}" stroke-width="1" opacity=".06"/>
          <circle cx="400" cy="400" r="160" stroke="{{color.line}}" stroke-width="1" opacity=".04"/>
          <line x1="120" y1="400" x2="680" y2="400" stroke="{{color.line}}" stroke-width="0.5" opacity=".06"/>
          <line x1="400" y1="120" x2="400" y2="680" stroke="{{color.line}}" stroke-width="0.5" opacity=".06"/>
          <path d="M200 500 Q300 300, 400 450 Q500 600, 600 350" stroke="{{color.line}}" stroke-width="1.5" opacity=".1" fill="none"/>
        </svg>
      </div>
      <div class="line-art__content">
        <h1 class="line-art__word">{{text.word}}</h1>
        <div class="line-art__line"></div>
        <div class="line-art__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),

  // ─────────────────────────────────────────────
  // 复古怀旧 · Retro Vintage
  // ─────────────────────────────────────────────

  createTemplate(
    {
      id: "pod-retro-arcade-badge",
      name: "复古游戏徽章印花",
      category: "复古怀旧",
      description: "8-bit 像素风格的复古游戏徽章，适合 T 恤、贴纸、杯子、鼠标垫印花。",
      tags: ["复古", "游戏", "像素", "徽章", "8bit"],
      sortOrder: 530,
    },
    [
      textField("text.title", "标题", "PLAYER ONE"),
      textField("text.score", "分数", "99999"),
      textField("text.level", "关卡", "LEVEL 42"),
      textField("text.lives", "生命", "♥♥♥"),
      colorField("color.bg", "背景色"),
      colorField("color.primary", "主色"),
      colorField("color.secondary", "辅色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "PLAYER ONE", score: "99999", level: "LEVEL 42", lives: "♥♥♥" },
      color: {
        bg: createPureColor("#0c0a09"),
        primary: createPureColor("#22c55e"),
        secondary: createPureColor("#eab308"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .arcade{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8%;box-sizing:border-box;position:relative;overflow:hidden;font-family:{{font.title.family}},'Courier New',monospace;}
      .arcade__scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.02) 2px, rgba(255,255,255,.02) 4px);pointer-events:none;}
      .arcade__border{position:absolute;inset:6%;border:3px solid {{color.primary}};opacity:.2;box-shadow:inset 0 0 30px rgba(34,197,94,.05);}
      .arcade__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.8vw,20px);text-align:center;}
      .arcade__header{font-size:clamp(10px,1.3vw,12px);letter-spacing:.4em;color:{{color.secondary}};text-transform:uppercase;text-shadow:0 0 10px rgba(234,179,8,.3);}
      .arcade__title{font-size:clamp(32px,7vw,80px);font-weight:900;color:{{color.primary}};letter-spacing:.08em;line-height:1;text-shadow:0 0 20px rgba(34,197,94,.4), 0 0 60px rgba(34,197,94,.15);}
      .arcade__score{font-size:clamp(18px,3.5vw,40px);color:{{color.secondary}};letter-spacing:.15em;text-shadow:0 0 12px rgba(234,179,8,.3);}
      .arcade__divider{width:80%;height:2px;background:linear-gradient(90deg, transparent, {{color.primary}}, transparent);opacity:.3;}
      .arcade__lives{font-size:clamp(16px,2.5vw,28px);color:#ef4444;letter-spacing:.2em;text-shadow:0 0 8px rgba(239,68,68,.4);}
      .arcade__footer{font-size:clamp(9px,1.1vw,11px);letter-spacing:.3em;color:{{color.primary}};opacity:.4;text-transform:uppercase;}
    </style>
    <div class="arcade">
      <div class="arcade__scanlines"></div>
      <div class="arcade__border"></div>
      <div class="arcade__content">
        <div class="arcade__header">{{text.level}}</div>
        <h1 class="arcade__title">{{text.title}}</h1>
        <div class="arcade__score">SCORE: {{text.score}}</div>
        <div class="arcade__divider"></div>
        <div class="arcade__lives">{{text.lives}}</div>
        <div class="arcade__footer">INSERT COIN TO CONTINUE</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-vintage-travel-poster",
      name: "复古旅行海报印花",
      category: "复古怀旧",
      description: "受 20 世纪旅行海报启发的复古风格，适合海报、T 恤、帆布袋印花。",
      tags: ["复古", "旅行", "海报", "怀旧", "插画风"],
      sortOrder: 540,
    },
    [
      textField("text.dest", "目的地", "PARIS"),
      textField("text.slogan", "标语", "The City of Light"),
      textField("text.year", "年份", "Est. 1889"),
      textareaField("text.desc", "描述", "Discover the charm of cobblestone streets, warm croissants, and the Eiffel Tower at sunset.", 3),
      colorField("color.bg", "背景色"),
      colorField("color.sun", "太阳色"),
      colorField("color.accent", "强调色"),
      fontField("font.dest", "目的地字体"),
    ],
    {
      text: {
        dest: "PARIS",
        slogan: "The City of Light",
        year: "Est. 1889",
        desc: "Discover the charm of cobblestone streets, warm croissants, and the Eiffel Tower at sunset.",
      },
      color: {
        bg: createPureColor("#fdf2e9"),
        sun: createPureColor("#f59e0b"),
        accent: createPureColor("#7c2d12"),
      },
      font: { dest: defaultFontBinding },
    },
    `<style>
      .travel{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;position:relative;overflow:hidden;}
      .travel__sky{flex:1.2;background:linear-gradient(180deg, #fde68a 0%, {{color.bg}} 100%);position:relative;display:flex;align-items:flex-end;justify-content:center;}
      .travel__sun{position:absolute;width:22%;aspect-ratio:1/1;border-radius:50%;background:{{color.sun}};opacity:.25;top:10%;right:18%;box-shadow:0 0 60px {{color.sun}};}
      .travel__mountains{width:100%;height:40%;position:relative;}
      .travel__mountain1{position:absolute;bottom:0;left:10%;width:0;height:0;border-left:20vw solid transparent;border-right:20vw solid transparent;border-bottom:30vh solid {{color.accent}};opacity:.12;}
      .travel__mountain2{position:absolute;bottom:0;right:5%;width:0;height:0;border-left:22vw solid transparent;border-right:22vw solid transparent;border-bottom:35vh solid {{color.accent}};opacity:.08;}
      .travel__ground{flex:1;background:linear-gradient(180deg, transparent, rgba(124,45,18,.04));position:relative;}
      .travel__content{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8%;box-sizing:border-box;text-align:center;gap:clamp(8px,1.2vw,14px);}
      .travel__dest{font-size:clamp(42px,9vw,108px);font-weight:900;letter-spacing:.12em;color:{{color.accent}};line-height:.9;font-family:{{font.dest.family}},serif;text-shadow:0 2px 0 rgba(124,45,18,.1);}
      .travel__slogan{font-size:clamp(14px,2vw,20px);letter-spacing:.15em;color:{{color.accent}};opacity:.7;font-style:italic;}
      .travel__line{width:clamp(40px,6vw,72px);height:2px;background:{{color.accent}};opacity:.3;}
      .travel__desc{max-width:70%;font-size:clamp(10px,1.3vw,13px);line-height:1.7;color:{{color.accent}};opacity:.55;}
      .travel__year{font-size:clamp(10px,1.2vw,12px);letter-spacing:.3em;color:{{color.accent}};opacity:.35;margin-top:8px;}
    </style>
    <div class="travel">
      <div class="travel__sky">
        <div class="travel__sun"></div>
      </div>
      <div class="travel__mountains">
        <div class="travel__mountain1"></div>
        <div class="travel__mountain2"></div>
      </div>
      <div class="travel__ground"></div>
      <div class="travel__content">
        <h1 class="travel__dest">{{text.dest}}</h1>
        <div class="travel__slogan">{{text.slogan}}</div>
        <div class="travel__line"></div>
        <p class="travel__desc">{{text.desc}}</p>
        <div class="travel__year">{{text.year}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-retro-stripe-tshirt",
      name: "复古条纹运动T恤",
      category: "复古怀旧",
      description: "受 70-80 年代运动服启发的条纹设计，适合 T 恤、运动衫、卫衣印花。",
      tags: ["复古", "运动", "条纹", "T恤", "80年代"],
      sortOrder: 550,
    },
    [
      textField("text.team", "队名", "THUNDER"),
      textField("text.number", "号码", "07"),
      textField("text.city", "城市", "LOS ANGELES"),
      textField("text.year", "年份", "'86"),
      colorField("color.bg", "背景色"),
      colorField("color.stripe", "条纹色"),
      colorField("color.text", "文字色"),
      fontField("font.team", "队名字体"),
    ],
    {
      text: { team: "THUNDER", number: "07", city: "LOS ANGELES", year: "'86" },
      color: {
        bg: createPureColor("#1e3a5f"),
        stripe: createPureColor("#e85d3a"),
        text: createPureColor("#f5f0e8"),
      },
      font: { team: defaultFontBinding },
    },
    `<style>
      .retro-stripe{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;font-family:{{font.team.family}},sans-serif;}
      .retro-stripe__stripes{position:absolute;inset:0;display:flex;flex-direction:column;}
      .retro-stripe__stripe{flex:1;border-top:clamp(4px,.8vw,8px) solid {{color.stripe}};opacity:.15;}
      .retro-stripe__stripe:nth-child(even){opacity:.08;}
      .retro-stripe__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(4px,.8vw,10px);text-align:center;padding:8%;box-sizing:border-box;}
      .retro-stripe__city{font-size:clamp(10px,1.3vw,13px);letter-spacing:.35em;color:{{color.text}};opacity:.5;text-transform:uppercase;}
      .retro-stripe__team{font-size:clamp(36px,8vw,96px);font-weight:900;color:{{color.text}};letter-spacing:.1em;line-height:1;text-shadow:4px 4px 0 {{color.stripe}}, 8px 8px 0 rgba(0,0,0,.15);}
      .retro-stripe__number-wrap{display:flex;align-items:center;gap:clamp(12px,2vw,24px);}
      .retro-stripe__line{width:clamp(30px,5vw,60px);height:3px;background:{{color.stripe}};border-radius:2px;}
      .retro-stripe__number{font-size:clamp(48px,10vw,120px);font-weight:900;color:{{color.stripe}};line-height:.85;text-shadow:3px 3px 0 rgba(0,0,0,.2);}
      .retro-stripe__year{font-size:clamp(12px,1.6vw,16px);letter-spacing:.25em;color:{{color.text}};opacity:.45;margin-top:4px;}
    </style>
    <div class="retro-stripe">
      <div class="retro-stripe__stripes">
        <div class="retro-stripe__stripe"></div><div class="retro-stripe__stripe"></div>
        <div class="retro-stripe__stripe"></div><div class="retro-stripe__stripe"></div>
        <div class="retro-stripe__stripe"></div><div class="retro-stripe__stripe"></div>
        <div class="retro-stripe__stripe"></div><div class="retro-stripe__stripe"></div>
      </div>
      <div class="retro-stripe__content">
        <div class="retro-stripe__city">{{text.city}}</div>
        <h1 class="retro-stripe__team">{{text.team}}</h1>
        <div class="retro-stripe__number-wrap">
          <div class="retro-stripe__line"></div>
          <div class="retro-stripe__number">{{text.number}}</div>
          <div class="retro-stripe__line"></div>
        </div>
        <div class="retro-stripe__year">{{text.year}}</div>
      </div>
    </div>`
  ),

  // ─────────────────────────────────────────────
  // 科技未来 · Tech Futuristic
  // ─────────────────────────────────────────────

  createTemplate(
    {
      id: "pod-circuit-board-pattern",
      name: "电路板纹理印花",
      category: "科技未来",
      description: "精密电路板走线纹理，适合 T 恤、鼠标垫、手机壳、海报等科技风商品。",
      tags: ["电路", "科技", "纹理", "未来", "鼠标垫"],
      sortOrder: 560,
    },
    [
      textField("text.brand", "品牌", "NEXUS"),
      textField("text.ver", "版本", "v4.2.0"),
      textField("text.tagline", "标语", "Connect Everything"),
      colorField("color.bg", "背景色"),
      colorField("color.circuit", "电路色"),
      colorField("color.node", "节点色"),
      fontField("font.brand", "品牌字体"),
    ],
    {
      text: { brand: "NEXUS", ver: "v4.2.0", tagline: "Connect Everything" },
      color: {
        bg: createPureColor("#020617"),
        circuit: createPureColor("#0ea5e9"),
        node: createPureColor("#22d3ee"),
      },
      font: { brand: defaultFontBinding },
    },
    `<style>
      .circuit{width:100%;height:100%;background:{{color.bg}};position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
      .circuit__svg{position:absolute;inset:0;width:100%;height:100%;}
      .circuit__svg svg{width:100%;height:100%;}
      .circuit__glow{position:absolute;width:40%;aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle, {{color.circuit}}, transparent 70%);opacity:.06;top:30%;left:30%;filter:blur(40px);}
      .circuit__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(12px,2vw,24px);text-align:center;font-family:{{font.brand.family}},sans-serif;}
      .circuit__brand{font-size:clamp(48px,10vw,120px);font-weight:900;color:{{color.circuit}};letter-spacing:.15em;line-height:1;text-shadow:0 0 30px rgba(14,165,233,.3), 0 0 80px rgba(14,165,233,.1);}
      .circuit__ver{font-size:clamp(10px,1.2vw,12px);letter-spacing:.3em;color:{{color.node}};opacity:.5;font-family:'SF Mono',Consolas,monospace;}
      .circuit__line{width:clamp(60px,10vw,120px);height:2px;background:linear-gradient(90deg, transparent, {{color.circuit}}, transparent);opacity:.4;}
      .circuit__tagline{font-size:clamp(13px,1.8vw,18px);letter-spacing:.12em;color:{{color.node}};opacity:.6;}
    </style>
    <div class="circuit">
      <div class="circuit__svg">
        <svg viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="200" x2="350" y2="200" stroke="{{color.circuit}}" stroke-width="1" opacity=".15"/>
          <line x1="350" y1="200" x2="350" y2="350" stroke="{{color.circuit}}" stroke-width="1" opacity=".15"/>
          <line x1="350" y1="350" x2="500" y2="350" stroke="{{color.circuit}}" stroke-width="1" opacity=".15"/>
          <line x1="500" y1="350" x2="500" y2="150" stroke="{{color.circuit}}" stroke-width="1" opacity=".15"/>
          <line x1="500" y1="150" x2="700" y2="150" stroke="{{color.circuit}}" stroke-width="1" opacity=".15"/>
          <line x1="150" y1="450" x2="300" y2="450" stroke="{{color.circuit}}" stroke-width="1" opacity=".1"/>
          <line x1="300" y1="450" x2="300" y2="600" stroke="{{color.circuit}}" stroke-width="1" opacity=".1"/>
          <line x1="300" y1="600" x2="550" y2="600" stroke="{{color.circuit}}" stroke-width="1" opacity=".1"/>
          <line x1="550" y1="600" x2="550" y2="450" stroke="{{color.circuit}}" stroke-width="1" opacity=".1"/>
          <line x1="550" y1="450" x2="700" y2="450" stroke="{{color.circuit}}" stroke-width="1" opacity=".1"/>
          <line x1="200" y1="100" x2="200" y2="300" stroke="{{color.circuit}}" stroke-width="1" opacity=".08"/>
          <line x1="200" y1="300" x2="400" y2="300" stroke="{{color.circuit}}" stroke-width="1" opacity=".08"/>
          <line x1="600" y1="250" x2="600" y2="500" stroke="{{color.circuit}}" stroke-width="1" opacity=".08"/>
          <line x1="600" y1="500" x2="750" y2="500" stroke="{{color.circuit}}" stroke-width="1" opacity=".08"/>
          <circle cx="350" cy="200" r="4" fill="{{color.node}}" opacity=".4"/>
          <circle cx="500" cy="350" r="4" fill="{{color.node}}" opacity=".4"/>
          <circle cx="300" cy="450" r="3" fill="{{color.node}}" opacity=".3"/>
          <circle cx="550" cy="600" r="4" fill="{{color.node}}" opacity=".3"/>
          <circle cx="200" cy="300" r="3" fill="{{color.node}}" opacity=".25"/>
          <circle cx="600" cy="500" r="3" fill="{{color.node}}" opacity=".25"/>
          <rect x="340" cy="190" y="190" width="20" height="20" rx="2" fill="none" stroke="{{color.node}}" stroke-width="1" opacity=".3"/>
          <rect x="490" y="340" width="20" height="20" rx="2" fill="none" stroke="{{color.node}}" stroke-width="1" opacity=".3"/>
        </svg>
      </div>
      <div class="circuit__glow"></div>
      <div class="circuit__content">
        <h1 class="circuit__brand">{{text.brand}}</h1>
        <div class="circuit__ver">{{text.ver}}</div>
        <div class="circuit__line"></div>
        <div class="circuit__tagline">{{text.tagline}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-holographic-gradient",
      name: "全息渐变潮流印花",
      category: "科技未来",
      description: "模拟全息材质的渐变折射效果，适合 T 恤、卫衣、手机壳、贴纸等潮流商品。",
      tags: ["全息", "渐变", "潮流", "科技", "T恤"],
      sortOrder: 570,
    },
    [
      textField("text.word", "主词", "PRISM"),
      textField("text.sub", "副词", "Refraction Series"),
      colorField("color.bg", "底色"),
      colorField("color.holo1", "全息色1"),
      colorField("color.holo2", "全息色2"),
      colorField("color.holo3", "全息色3"),
      fontField("font.word", "主词字体"),
    ],
    {
      text: { word: "PRISM", sub: "Refraction Series" },
      color: {
        bg: createPureColor("#0f0f0f"),
        holo1: createPureColor("#c084fc"),
        holo2: createPureColor("#22d3ee"),
        holo3: createPureColor("#fb7185"),
      },
      font: { word: defaultFontBinding },
    },
    `<style>
      .holo{width:100%;height:100%;background:{{color.bg}};display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;}
      .holo__layer1{position:absolute;inset:-20%;background:conic-gradient(from 0deg at 50% 50%, {{color.holo1}}, {{color.holo2}}, {{color.holo3}}, {{color.holo1}});opacity:.18;filter:blur(60px);animation:holo-spin 8s linear infinite;}
      .holo__layer2{position:absolute;inset:0;background:linear-gradient(135deg, rgba(255,255,255,.03) 0%, transparent 50%, rgba(255,255,255,.02) 100%);}
      .holo__stripe{position:absolute;inset:0;background:repeating-linear-gradient(120deg, transparent, transparent 8px, rgba(255,255,255,.015) 8px, rgba(255,255,255,.015) 16px);}
      @keyframes holo-spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
      .holo__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(12px,2vw,24px);text-align:center;}
      .holo__word{font-size:clamp(56px,13vw,160px);font-weight:900;letter-spacing:.06em;line-height:.85;font-family:{{font.word.family}},sans-serif;background:linear-gradient(135deg, {{color.holo1}}, {{color.holo2}}, {{color.holo3}}, {{color.holo1}});-webkit-background-clip:text;background-clip:text;color:transparent;background-size:300% 300%;animation:holo-gradient 4s ease infinite;}
      @keyframes holo-gradient{0%,100%{background-position:0% 50%;}50%{background-position:100% 50%;}}
      .holo__line{width:clamp(60px,10vw,120px);height:2px;background:linear-gradient(90deg, {{color.holo1}}, {{color.holo2}}, {{color.holo3}});border-radius:1px;}
      .holo__sub{font-size:clamp(12px,1.6vw,16px);letter-spacing:.2em;color:rgba(255,255,255,.4);text-transform:uppercase;}
    </style>
    <div class="holo">
      <div class="holo__layer1"></div>
      <div class="holo__layer2"></div>
      <div class="holo__stripe"></div>
      <div class="holo__content">
        <h1 class="holo__word">{{text.word}}</h1>
        <div class="holo__line"></div>
        <div class="holo__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-data-matrix-dark",
      name: "数据矩阵暗黑印花",
      category: "科技未来",
      description: "数字矩阵 + 故障风格大标题，适合 T 恤、帽衫、鼠标垫、海报等赛博朋克风商品。",
      tags: ["数据", "矩阵", "赛博", "暗黑", "程序员"],
      sortOrder: 580,
    },
    [
      textField("text.title", "标题", "SYSTEM"),
      textField("text.code", "代码", "0x4F52"),
      textField("text.status", "状态", "ONLINE"),
      colorField("color.bg", "背景色"),
      colorField("color.primary", "主色"),
      colorField("color.glitch", "故障色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "SYSTEM", code: "0x4F52", status: "ONLINE" },
      color: {
        bg: createPureColor("#030712"),
        primary: createPureColor("#4ade80"),
        glitch: createPureColor("#f43f5e"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .matrix{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden;font-family:{{font.title.family}},monospace;}
      .matrix__rain{position:absolute;inset:0;display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:repeat(8,1fr);gap:1px;opacity:.08;}
      .matrix__cell{background:{{color.primary}};border-radius:1px;display:flex;align-items:center;justify-content:center;font-size:clamp(6px,.8vw,9px);color:{{color.primary}};}
      .matrix__glitch-line{position:absolute;width:100%;height:2px;background:{{color.glitch}};opacity:.06;left:0;}
      .matrix__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.5vw,18px);text-align:center;}
      .matrix__status{display:flex;align-items:center;gap:8px;font-size:clamp(10px,1.2vw,12px);letter-spacing:.3em;color:{{color.primary}};opacity:.6;}
      .matrix__dot{width:8px;height:8px;border-radius:50%;background:{{color.primary}};box-shadow:0 0 8px {{color.primary}};}
      .matrix__title{font-size:clamp(48px,11vw,140px);font-weight:900;color:{{color.primary}};letter-spacing:.1em;line-height:1;text-shadow:3px 0 {{color.glitch}}, -3px 0 rgba(56,189,248,.5), 0 0 20px rgba(74,222,128,.3);}
      .matrix__code{font-size:clamp(11px,1.4vw,14px);letter-spacing:.25em;color:{{color.primary}};opacity:.35;font-family:'SF Mono',Consolas,monospace;}
      .matrix__bar{width:clamp(120px,20vw,280px);height:4px;background:linear-gradient(90deg, transparent, {{color.primary}}, transparent);opacity:.25;border-radius:2px;}
      .matrix__footer{font-size:clamp(9px,1.1vw,11px);letter-spacing:.4em;color:rgba(255,255,255,.15);text-transform:uppercase;}
    </style>
    <div class="matrix">
      <div class="matrix__rain">
        <div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">1</div><div class="matrix__cell">1</div><div class="matrix__cell">0</div><div class="matrix__cell">0</div>
        <div class="matrix__cell">0</div><div class="matrix__cell">0</div><div class="matrix__cell">1</div><div class="matrix__cell">1</div>
      </div>
      <div class="matrix__glitch-line" style="top:25%"></div>
      <div class="matrix__glitch-line" style="top:65%"></div>
      <div class="matrix__content">
        <div class="matrix__status"><div class="matrix__dot"></div>{{text.status}}</div>
        <h1 class="matrix__title">{{text.title}}</h1>
        <div class="matrix__code">{{text.code}}</div>
        <div class="matrix__bar"></div>
        <div class="matrix__footer">// authenticated_access_only</div>
      </div>
    </div>`
  ),

  // ─────────────────────────────────────────────
  // 自然有机 · Natural Organic
  // ─────────────────────────────────────────────

  createTemplate(
    {
      id: "pod-botanical-illustration",
      name: "植物学插画印花",
      category: "自然有机",
      description: "植物学标本风格的插画排版，适合帆布袋、T 恤、贴纸、明信片印花。",
      tags: ["植物", "插画", "自然", "帆布袋", "标本"],
      sortOrder: 590,
    },
    [
      textField("text.plant", "植物名", "Monstera Deliciosa"),
      textField("text.common", "俗名", "Swiss Cheese Plant"),
      textField("text.family", "科属", "Family: Araceae"),
      textareaField("text.note", "注释", "Native to tropical forests of southern Mexico, south to Panama.", 2),
      colorField("color.bg", "背景色"),
      colorField("color.leaf", "叶色"),
      colorField("color.text", "文字色"),
      fontField("font.plant", "植物名字体"),
    ],
    {
      text: {
        plant: "Monstera Deliciosa",
        common: "Swiss Cheese Plant",
        family: "Family: Araceae",
        note: "Native to tropical forests of southern Mexico, south to Panama.",
      },
      color: {
        bg: createPureColor("#fefce8"),
        leaf: createPureColor("#166534"),
        text: createPureColor("#1c1917"),
      },
      font: { plant: defaultFontBinding },
    },
    `<style>
      .botanical{width:100%;height:100%;background:{{color.bg}};display:flex;flex-direction:column;position:relative;overflow:hidden;}
      .botanical__illustration{flex:1.3;display:flex;align-items:center;justify-content:center;position:relative;}
      .botanical__leaf-group{position:relative;width:60%;max-width:360px;aspect-ratio:1/1;}
      .botanical__leaf{position:absolute;border-radius:50% 0 50% 0;}
      .botanical__leaf--1{width:55%;height:70%;background:{{color.leaf}};opacity:.15;top:5%;left:22%;transform:rotate(-15deg);}
      .botanical__leaf--2{width:45%;height:60%;background:{{color.leaf}};opacity:.1;top:18%;left:35%;transform:rotate(20deg);}
      .botanical__leaf--3{width:35%;height:50%;background:{{color.leaf}};opacity:.2;top:25%;left:10%;transform:rotate(-35deg);}
      .botanical__stem{position:absolute;width:2px;height:50%;background:{{color.leaf}};opacity:.2;left:50%;bottom:0;transform:translateX(-50%);}
      .botanical__circle{position:absolute;width:70%;aspect-ratio:1/1;border:1px solid {{color.leaf}};border-radius:50%;opacity:.1;top:15%;left:15%;}
      .botanical__info{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6% 10%;box-sizing:border-box;text-align:center;gap:clamp(6px,1vw,10px);border-top:1px solid rgba(22,101,52,.1);}
      .botanical__plant{font-size:clamp(18px,3.5vw,36px);font-weight:600;font-style:italic;color:{{color.text}};font-family:{{font.plant.family}},serif;letter-spacing:.02em;}
      .botanical__common{font-size:clamp(11px,1.4vw,14px);color:{{color.text}};opacity:.5;letter-spacing:.08em;}
      .botanical__family{font-size:clamp(9px,1.1vw,11px);letter-spacing:.2em;color:{{color.leaf}};opacity:.5;text-transform:uppercase;margin-top:4px;}
      .botanical__note{max-width:80%;font-size:clamp(10px,1.2vw,12px);line-height:1.7;color:{{color.text}};opacity:.4;margin-top:4px;}
    </style>
    <div class="botanical">
      <div class="botanical__illustration">
        <div class="botanical__leaf-group">
          <div class="botanical__leaf botanical__leaf--1"></div>
          <div class="botanical__leaf botanical__leaf--2"></div>
          <div class="botanical__leaf botanical__leaf--3"></div>
          <div class="botanical__stem"></div>
          <div class="botanical__circle"></div>
        </div>
      </div>
      <div class="botanical__info">
        <h2 class="botanical__plant">{{text.plant}}</h2>
        <div class="botanical__common">{{text.common}}</div>
        <div class="botanical__family">{{text.family}}</div>
        <p class="botanical__note">{{text.note}}</p>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-terrazzo-natural",
      name: "水磨石自然纹理印花",
      category: "自然有机",
      description: "水磨石风格的自然有机纹理，适合鼠标垫、手机壳、笔记本封面、杯垫印花。",
      tags: ["水磨石", "纹理", "自然", "有机", "鼠标垫"],
      sortOrder: 600,
    },
    [
      textField("text.brand", "品牌", "STONE & CO"),
      textField("text.sub", "副标题", "Natural Elements"),
      colorField("color.bg", "底色"),
      colorField("color.chip1", "碎石色1"),
      colorField("color.chip2", "碎石色2"),
      colorField("color.chip3", "碎石色3"),
      fontField("font.brand", "品牌字体"),
    ],
    {
      text: { brand: "STONE & CO", sub: "Natural Elements" },
      color: {
        bg: createPureColor("#f5f0eb"),
        chip1: createPureColor("#d6b89a"),
        chip2: createPureColor("#a3b18a"),
        chip3: createPureColor("#b5838d"),
      },
      font: { brand: defaultFontBinding },
    },
    `<style>
      .terrazzo{width:100%;height:100%;background:{{color.bg}};position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
      .terrazzo__chips{position:absolute;inset:0;}
      .terrazzo__chip{position:absolute;border-radius:40% 60% 50% 50%;}
      .terrazzo__c1{width:8%;height:5%;background:{{color.chip1}};opacity:.35;top:12%;left:8%;transform:rotate(23deg);}
      .terrazzo__c2{width:6%;height:9%;background:{{color.chip2}};opacity:.25;top:25%;right:15%;transform:rotate(-15deg);border-radius:50%;}
      .terrazzo__c3{width:10%;height:4%;background:{{color.chip3}};opacity:.3;top:45%;left:5%;transform:rotate(45deg);}
      .terrazzo__c4{width:5%;height:7%;background:{{color.chip1}};opacity:.2;bottom:20%;right:10%;transform:rotate(-30deg);}
      .terrazzo__c5{width:7%;height:5%;background:{{color.chip2}};opacity:.3;bottom:35%;left:20%;transform:rotate(60deg);border-radius:50%;}
      .terrazzo__c6{width:4%;height:6%;background:{{color.chip3}};opacity:.25;top:60%;right:25%;transform:rotate(10deg);}
      .terrazzo__c7{width:9%;height:3%;background:{{color.chip1}};opacity:.15;top:8%;right:35%;transform:rotate(-50deg);}
      .terrazzo__c8{width:6%;height:4%;background:{{color.chip2}};opacity:.2;bottom:10%;left:40%;transform:rotate(30deg);border-radius:50%;}
      .terrazzo__c9{width:3%;height:5%;background:{{color.chip3}};opacity:.3;top:70%;left:12%;transform:rotate(-20deg);}
      .terrazzo__c10{width:7%;height:3%;background:{{color.chip1}};opacity:.18;bottom:50%;right:5%;transform:rotate(70deg);}
      .terrazzo__c11{width:5%;height:8%;background:{{color.chip2}};opacity:.15;top:35%;left:35%;transform:rotate(-40deg);border-radius:50%;}
      .terrazzo__c12{width:4%;height:4%;background:{{color.chip3}};opacity:.22;bottom:45%;right:30%;transform:rotate(15deg);}
      .terrazzo__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.5vw,18px);text-align:center;padding:10%;box-sizing:border-box;}
      .terrazzo__brand{font-size:clamp(32px,7vw,80px);font-weight:800;letter-spacing:.1em;color:#3f3530;font-family:{{font.brand.family}},serif;line-height:1;}
      .terrazzo__divider{width:clamp(40px,6vw,72px);height:2px;background:#3f3530;opacity:.2;border-radius:1px;}
      .terrazzo__sub{font-size:clamp(11px,1.5vw,15px);letter-spacing:.2em;color:#3f3530;opacity:.45;text-transform:uppercase;}
    </style>
    <div class="terrazzo">
      <div class="terrazzo__chips">
        <div class="terrazzo__chip terrazzo__c1"></div>
        <div class="terrazzo__chip terrazzo__c2"></div>
        <div class="terrazzo__chip terrazzo__c3"></div>
        <div class="terrazzo__chip terrazzo__c4"></div>
        <div class="terrazzo__chip terrazzo__c5"></div>
        <div class="terrazzo__chip terrazzo__c6"></div>
        <div class="terrazzo__chip terrazzo__c7"></div>
        <div class="terrazzo__chip terrazzo__c8"></div>
        <div class="terrazzo__chip terrazzo__c9"></div>
        <div class="terrazzo__chip terrazzo__c10"></div>
        <div class="terrazzo__chip terrazzo__c11"></div>
        <div class="terrazzo__chip terrazzo__c12"></div>
      </div>
      <div class="terrazzo__content">
        <h1 class="terrazzo__brand">{{text.brand}}</h1>
        <div class="terrazzo__divider"></div>
        <div class="terrazzo__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),

  createTemplate(
    {
      id: "pod-mountain-vista",
      name: "山景晨昏风光印花",
      category: "自然有机",
      description: "层叠山峦与渐变天色的自然风光，适合海报、T 恤、帆布袋、手机壳印花。",
      tags: ["山", "风光", "自然", "渐变", "海报"],
      sortOrder: 610,
    },
    [
      textField("text.title", "标题", "WANDER"),
      textField("text.sub", "副标题", "Find your mountain"),
      colorField("color.sky", "天空色"),
      colorField("color.peak", "山峰色"),
      colorField("color.sun", "日光色"),
      fontField("font.title", "标题字体"),
    ],
    {
      text: { title: "WANDER", sub: "Find your mountain" },
      color: {
        sky: createPureColor("#1e1b4b"),
        peak: createPureColor("#0f172a"),
        sun: createPureColor("#f59e0b"),
      },
      font: { title: defaultFontBinding },
    },
    `<style>
      .mountain{width:100%;height:100%;background:linear-gradient(180deg, {{color.sky}} 0%, #312e81 40%, {{color.sun}} 85%, #fef3c7 100%);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;}
      .mountain__sun{position:absolute;width:18%;aspect-ratio:1/1;border-radius:50%;background:{{color.sun}};bottom:18%;left:50%;transform:translateX(-50%);opacity:.6;box-shadow:0 0 60px {{color.sun}}, 0 0 120px rgba(245,158,11,.3);}
      .mountain__range{position:absolute;bottom:0;width:100%;height:55%;}
      .mountain__peak{position:absolute;bottom:0;}
      .mountain__p1{left:-5%;width:55%;height:100%;background:{{color.peak}};clip-path:polygon(0% 100%, 30% 20%, 55% 45%, 80% 10%, 100% 100%);opacity:.9;}
      .mountain__p2{right:-5%;width:60%;height:90%;background:linear-gradient(180deg, #1e293b, {{color.peak}});clip-path:polygon(0% 100%, 20% 35%, 45% 15%, 70% 40%, 100% 25%, 100% 100%);opacity:.8;}
      .mountain__p3{left:10%;width:45%;height:70%;background:#334155;clip-path:polygon(0% 100%, 40% 25%, 60% 50%, 100% 30%, 100% 100%);opacity:.5;}
      .mountain__mist{position:absolute;bottom:30%;width:100%;height:15%;background:linear-gradient(180deg, transparent, rgba(255,255,255,.08), transparent);}
      .mountain__content{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:clamp(10px,1.5vw,18px);text-align:center;padding-top:6%;}
      .mountain__title{font-size:clamp(44px,10vw,120px);font-weight:900;letter-spacing:.12em;color:#fef3c7;line-height:.9;font-family:{{font.title.family}},sans-serif;text-shadow:0 4px 20px rgba(0,0,0,.3);}
      .mountain__sub{font-size:clamp(12px,1.6vw,16px);letter-spacing:.15em;color:#fef3c7;opacity:.6;font-style:italic;}
    </style>
    <div class="mountain">
      <div class="mountain__sun"></div>
      <div class="mountain__range">
        <div class="mountain__peak mountain__p3"></div>
        <div class="mountain__peak mountain__p1"></div>
        <div class="mountain__peak mountain__p2"></div>
      </div>
      <div class="mountain__mist"></div>
      <div class="mountain__content">
        <h1 class="mountain__title">{{text.title}}</h1>
        <div class="mountain__sub">{{text.sub}}</div>
      </div>
    </div>`
  ),
];
