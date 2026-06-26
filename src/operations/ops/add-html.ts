import { registerOperation } from "../registry";
import {
  prepareHtmlArtworkOptions,
  updateExistingHtmlArtwork,
  getDirectExternalResourceError,
} from "./add-child";
import { isRecentImageUrl, getRecentImageUrls } from "@/ai/services/resource";

registerOperation({
  id: "canvas.addHtml",
  name: "创建 HTML 设计",
  description:
    "用 HTML/CSS 创建设计作品（最常用工具）。一个 htmlContent 包含完整画面：背景、装饰、文字、图片位等。再次调用会自动替换已有 HTML 作品。",
  group: "画布",
  params: [
    {
      name: "htmlContent",
      label: "HTML 代码",
      type: "string",
      required: true,
      placeholder: '<div style="...">...</div>',
      description: [
        "完整的 HTML/CSS 代码，元素默认填满画布（width:100%;height:100%）。",
        "",
        "【画布坐标】字号用 px：标题 200-400px，副标题 120-200px，正文 80-140px。间距/圆角/边距也用 px。",
        "",
        "【常用模式】",
        "居中文字: display:flex;align-items:center;justify-content:center;",
        "渐变背景: background:linear-gradient(135deg,#667eea,#764ba2);",
        "卡片: background:#fff;border-radius:24px;padding:60px;box-shadow:0 8px 32px rgba(0,0,0,0.1);",
        "叠加: position:absolute;inset:0; 配合父元素 position:relative;",
        "",
        "【资源绑定】图片/字体必须通过 htmlBindings 传入，HTML 中用 {{image.key.url}} / {{font.key.family}} 引用，禁止直接写外部 URL。",
        "",
        "【禁止】纯黑 #000000、纯白 #ffffff、<script> 标签、外部图片链接",
      ].join("\n"),
    },
    {
      name: "htmlBindings",
      label: "资源绑定",
      type: "object",
      description: [
        "绑定图片和字体资源。格式：",
        '{ "image": { "photo": { "id":"xxx", "url":"https://...", "name":"名称" } } }',
        '{ "font": { "title": { "id":"xxx", "url":"https://...", "name":"字体名" } } }',
        "HTML 中用 {{image.photo.url}} 和 {{font.title.family}} 引用。",
      ].join("\n"),
    },
    {
      name: "htmlTemplateFields",
      label: "模板字段",
      type: "array",
      description: "定义模板中可被用户替换的字段（type: font/image/text/color/number）",
    },
    {
      name: "htmlTemplateDefaultBindings",
      label: "模板默认绑定",
      type: "object",
      description: "模板字段的默认值",
    },
    {
      name: "htmlTemplateMeta",
      label: "模板元信息",
      type: "object",
      description: "模板的元数据",
    },
    {
      name: "allowMultipleHtml",
      label: "允许多个 HTML",
      type: "boolean",
      default: false,
      description: "默认 false：再次调用会替换已有 HTML 作品。设为 true 可叠加多个 HTML 层。",
    },
  ],
  execute(params, ctx) {
    const {
      htmlContent,
      htmlBindings,
      htmlTemplateFields,
      htmlTemplateDefaultBindings,
      htmlTemplateMeta,
      allowMultipleHtml,
    } = params;

    // 校验：图片绑定中是否有重复 URL 或重复 ID
    if (htmlBindings) {
      let bindings: any = htmlBindings;
      if (typeof bindings === 'string') {
        try { bindings = JSON.parse(bindings); } catch {}
      }
      const imageBindings = bindings?.image;
      if (imageBindings && typeof imageBindings === 'object') {
        const entries = Object.entries(imageBindings);
        if (entries.length > 1) {
          const urlToKeys = new Map<string, string[]>();
          const idToKeys = new Map<string, string[]>();
          for (const [key, val] of entries) {
            const v = val as any;
            if (v?.url) {
              if (!urlToKeys.has(v.url)) urlToKeys.set(v.url, []);
              urlToKeys.get(v.url)!.push(key);
            }
            if (v?.id) {
              if (!idToKeys.has(v.id)) idToKeys.set(v.id, []);
              idToKeys.get(v.id)!.push(key);
            }
          }
          const urlDups = Array.from(urlToKeys.entries()).filter(([, keys]) => keys.length > 1);
          const idDups = Array.from(idToKeys.entries()).filter(([, keys]) => keys.length > 1);
          if (urlDups.length > 0 || idDups.length > 0) {
            const lines: string[] = [];
            if (urlDups.length > 0) {
              lines.push('以下绑定使用了相同的图片 URL：');
              urlDups.forEach(([url, keys]) => lines.push(`  ${keys.join(', ')} → 同一张图`));
            }
            if (idDups.length > 0) {
              lines.push('以下绑定使用了相同的图片 ID：');
              idDups.forEach(([id, keys]) => lines.push(`  ${keys.join(', ')} → 同一张图 (id: ${id.slice(0, 8)}...)`));
            }
            return {
              success: false,
              message: `【图片重复】检测到多个绑定指向同一张图片！\n${lines.join('\n')}\n\n你需要：\n1. 搜索多张不同的图片（resource.searchImage，返回多条结果）\n2. 每张图片绑定为不同的 key\n3. 每个 key 必须使用不同的 id 和不同的 url\n\n禁止用同一张图片的 background-position 裁切冒充多张！`,
              data: { rejected: true, reason: 'duplicate_image_bindings' },
            };
          }
        }
      }
    }

    // 校验：图片绑定中的 URL 是否来自真实搜索结果
    if (htmlBindings) {
      let bindings: any = htmlBindings;
      if (typeof bindings === 'string') {
        try { bindings = JSON.parse(bindings); } catch {}
      }
      const imageBindings = bindings?.image;
      if (imageBindings && typeof imageBindings === 'object') {
        const fakeUrls: string[] = [];
        for (const [key, val] of Object.entries(imageBindings)) {
          const url = (val as any)?.url;
          if (url && !isRecentImageUrl(url)) {
            fakeUrls.push(`  ${key} → ${url.slice(0, 60)}...`);
          }
        }
        if (fakeUrls.length > 0) {
          const recentUrls = getRecentImageUrls();
          const hint = recentUrls.length > 0
            ? `\n以下是最近搜索到的真实图片 URL（请直接使用）：\n${recentUrls.slice(0, 6).map((u, i) => `  ${i + 1}. ${u.slice(0, 80)}...`).join('\n')}`
            : '\n请先用 resource.searchImage 搜索图片，然后使用返回的真实 url。';
          return {
            success: false,
            message:`【虚假 URL】以下绑定的图片 URL 不在搜索结果中（AI 编造的）：\n${fakeUrls.join('\n')}${hint}\n\n你必须使用 resource.searchImage 返回的真实 url，禁止编造 URL！`,
            data: { rejected: true, reason: 'fake_image_urls' },
          };
        }
      }
    }

    const options: Record<string, any> = { htmlContent };
    if (htmlBindings !== undefined) options.htmlBindings = htmlBindings;
    if (htmlTemplateFields !== undefined) options.htmlTemplateFields = htmlTemplateFields;
    if (htmlTemplateDefaultBindings !== undefined) options.htmlTemplateDefaultBindings = htmlTemplateDefaultBindings;
    if (htmlTemplateMeta !== undefined) options.htmlTemplateMeta = htmlTemplateMeta;

    // 尝试替换已有 HTML 作品
    if (!allowMultipleHtml) {
      const replaceResult = updateExistingHtmlArtwork(ctx, options);
      if (replaceResult) {
        if (replaceResult.rejected) {
          return {
            success: false,
            message: replaceResult.message || "请提交完整 htmlContent。",
            data: { id: replaceResult.id, rejected: true },
          };
        }
        // 替换成功
        const totalElements = ctx
          .getCanvasChildren()
          .filter((c: any) => c.type !== "canvas").length;
        return {
          success: true,
          message: `已更新 HTML 设计 (id: ${replaceResult.id})，当前画布共 ${totalElements} 个元素。`,
          data: { id: replaceResult.id, type: "html", totalElements, replaced: true },
        };
      }
    }

    // 新增 HTML 元素
    const prepared = prepareHtmlArtworkOptions(options);
    const directError = getDirectExternalResourceError(prepared);
    if (directError) {
      return { success: false, message: directError, data: { rejected: true, reason: "direct_external_resource_url" } };
    }

    const id = ctx.addCanvasChild("html", prepared);
    const totalElements = ctx.getCanvasChildren().filter((c: any) => c.type !== "canvas").length;
    return {
      success: true,
      message: `已创建 HTML 设计 (id: ${id})，当前画布共 ${totalElements} 个元素。如需优化，请传入完整 htmlContent 替换。`,
      data: { id, type: "html", totalElements, replaced: false },
    };
  },
});
