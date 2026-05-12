/**
 * @description 支持 HTML 画布元素
 */

import { canvasStickerOptionsOnlyChild, updateRenderingCanvas } from "../index.tsx";
import { createFilterFromOptions, createTransformString, formatToNativeSizeString } from "../helper.tsx";
import { computed, defineComponent, ref, watchEffect } from "vue";
import {
  createFilterDefaultOptions,
  createTransformDefaultOptions,
} from "./defaultOptions.tsx";
import { onCanvasChildSetup, onBeforeReturnRender } from "./commonHooks.ts";
import {
  createHtmlRenderPayload,
  ensureHtmlTemplateFontsLoaded,
  ensureHtmlTemplateOptions,
} from "../htmlTemplate/runtime.ts";

export const createDefaultCanvasChildHtmlOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "html",
    htmlContent: "",
    htmlBindings: {},
    htmlTemplateFields: [],
    htmlTemplateDefaultBindings: {},
    htmlTemplateMeta: null,
    transform: createTransformDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
  };
};

export function createCanvasChildHtml(options) {
  return (
    <Html
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></Html>
  );
}

export const Html = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetElRef = ref();

    onCanvasChildSetup({
      targetEl: targetElRef,
      options: props.options,
      props: props,
    });

    watchEffect(() => {
      ensureHtmlTemplateOptions(props.options);
      ensureHtmlTemplateFontsLoaded(
        props.options?.htmlTemplateFields || [],
        props.options?.htmlBindings || {}
      );
    });

    const renderPayload = computed(() => createHtmlRenderPayload(props.options));

    return () => {
      const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;
      const canvasWidthCss = formatToNativeSizeString(canvasStickerOptionsOnlyChild.value.width);
      const canvasHeightCss = formatToNativeSizeString(canvasStickerOptionsOnlyChild.value.height);
      const canvasFontSizeCss = formatToNativeSizeString(
        canvasStickerOptionsOnlyChild.value.fontSize || { value: 32, unit: "px" }
      );
      const filterOptions =
        props.options?.filter || createFilterDefaultOptions(canvasUnit);

      const containerStyle: Record<string, string> = {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: "0",
        left: "0",
      };

      const style: Record<string, string | number> = {
        "--canvas-html-width": canvasWidthCss,
        "--canvas-html-height": canvasHeightCss,
        "--canvas-html-vw": `calc(${canvasWidthCss} / 100)`,
        "--canvas-html-vh": `calc(${canvasHeightCss} / 100)`,
        "--canvas-font-size": canvasFontSizeCss,
        flexShrink: 0,
        width: "100%",
        height: "100%",
        transform: createTransformString(props.options.transform),
        filter: createFilterFromOptions(filterOptions),
        zIndex: props.options?.zIndex ?? 0,
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        minWidth: "100%",
        minHeight: "100%",
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div
            class={`${renderPayload.value.scopeClassName} canvas-html-child`}
            style={style}
            ref={targetElRef}
          >
            <style>{`
              .${renderPayload.value.scopeClassName} .canvas-html-child__content,
              .${renderPayload.value.scopeClassName} .canvas-html-child__content * {
                all: revert;
                box-sizing: border-box;
              }

              .${renderPayload.value.scopeClassName} .canvas-html-child__content {
                display: block;
                width: 100%;
                height: 100%;
                position: absolute;
                inset: 0;
                overflow: hidden;
              }

              .${renderPayload.value.scopeClassName} .canvas-html-child__content style,
              .${renderPayload.value.scopeClassName} .canvas-html-child__content script {
                display: none;
              }
            `}</style>
            {renderPayload.value.scopedCss ? <style>{renderPayload.value.scopedCss}</style> : null}

            {renderPayload.value.sanitizedHtml ? (
              <div
                class="canvas-html-child__content"
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  inset: "0",
                  display: "block",
                  overflow: "hidden",
                  boxSizing: "border-box",
                  fontSize: "var(--canvas-font-size)",
                  minWidth: "100%",
                  minHeight: "100%"
                }}
                innerHTML={renderPayload.value.sanitizedHtml}
              ></div>
            ) : (
              <div
                class="canvas-html-child__placeholder"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "14px",
                }}
              >
                输入 HTML 代码
              </div>
            )}
          </div>
        </div>
      );
    };
  },
});
