import { computed, defineComponent, nextTick, ref, watch } from "vue";
import {
  canvasStickerOptionsOnlyChild,
  updateRenderingCanvas,
} from "../index.tsx";
import {
  createFilterFromOptions,
  createTransformString,
  formatToNativeSizeString,
  getPositionInfoFromOptions,
} from "../helper.tsx";
import {
  createBasicDefaultOptions,
  createFilterDefaultOptions,
  createPositionDefaultOptions,
  createTransformDefaultOptions,
} from "./defaultOptions.tsx";
import { onBeforeReturnRender, onCanvasChildSetup } from "./commonHooks.ts";

let rdkitLoader: Promise<any> | null = null;
let rdkitInstance: any = null;

type RDKitLoaderFn = (options?: { locateFile?: () => string }) => Promise<any>;

export const MOLECULE_INPUT_TYPES = ["smiles", "molblock"] as const;

export const createDefaultCanvasChildMoleculeOptions = () => {
  const canvasUnit = canvasStickerOptionsOnlyChild.value.width.unit;

  return {
    type: "molecule",
    inputType: "smiles" as const,
    source: "c1ccccc1",
    drawOptions: {},
    backgroundColor: {
      type: "pure",
      color: "transparent",
    },
    width: {
      value: 100,
      unit: "vw",
    },
    height: {
      value: 100,
      unit: "vh",
    },
    position: createPositionDefaultOptions(canvasUnit),
    filter: createFilterDefaultOptions(canvasUnit),
    zIndex: 0,
    ...createBasicDefaultOptions(),
    transform: createTransformDefaultOptions(canvasUnit),
  };
};

export function createCanvasChildMolecule(options: any) {
  return (
    <MoleculeChild
      options={options}
      onVnodeUpdated={updateRenderingCanvas}
      onVnodeMounted={updateRenderingCanvas}
    ></MoleculeChild>
  );
}

async function loadRDKit(): Promise<any> {
  if (rdkitInstance) return rdkitInstance;

  if (!rdkitLoader) {
    rdkitLoader = (async () => {
      const rdkitModule = await import("@rdkit/rdkit");
      const initRDKitModule = rdkitModule.default as RDKitLoaderFn;
      const rdkitWasmUrl = new URL(
        "@rdkit/rdkit/dist/RDKit_minimal.wasm",
        import.meta.url,
      ).href;
      rdkitInstance = await initRDKitModule({
        locateFile: () => rdkitWasmUrl,
      });
      return rdkitInstance;
    })();
  }

  return rdkitLoader;
}

function renderMoleculeSvg(
  rdkit: any,
  source: string,
  inputType: string,
  width: number,
  height: number,
  drawOptions: Record<string, any>,
): string {
  let mol: any = null;

  try {
    if (inputType === "molblock") {
      mol = rdkit.get_mol(source);
    } else {
      mol = rdkit.get_mol(source);
    }

    if (!mol) {
      throw new Error("分子结构解析失败，请检查 SMILES 或 MolBlock 格式");
    }

    let svg: string;
    if (drawOptions && Object.keys(drawOptions).length > 0) {
      svg = mol.get_svg_with_highlights(JSON.stringify(drawOptions));
    } else {
      svg = mol.get_svg(width, height);
    }

    return svg;
  } finally {
    if (mol) {
      mol.delete();
    }
  }
}

export const MoleculeChild = defineComponent({
  props: {
    options: null,
  },
  setup(props) {
    const targetRef = ref<HTMLElement>();
    const svgHtml = ref("");
    const errorMessage = ref("");
    let renderToken = 0;

    onCanvasChildSetup({
      targetEl: targetRef,
      options: props.options,
      props,
    });

    const source = computed(() => String(props.options?.source || ""));
    const inputType = computed(() =>
      String(props.options?.inputType || "smiles"),
    );
    const drawOptions = computed(() => props.options?.drawOptions || {});

    async function renderMolecule() {
      const token = ++renderToken;

      try {
        errorMessage.value = "";
        const rdkit = await loadRDKit();

        const width = 350;
        const height = 350;

        const svg = renderMoleculeSvg(
          rdkit,
          source.value,
          inputType.value,
          width,
          height,
          drawOptions.value,
        );

        if (token !== renderToken) return;
        svgHtml.value = svg;
      } catch (error: any) {
        if (token !== renderToken) return;
        svgHtml.value = "";
        errorMessage.value = error?.message || "分子结构渲染失败";
      } finally {
        if (token === renderToken) {
          await nextTick();
          updateRenderingCanvas();
        }
      }
    }

    watch(
      () => [source.value, inputType.value, drawOptions.value],
      renderMolecule,
      {
        immediate: true,
        deep: true,
      },
    );

    return () => {
      const { containerStyle: _containerStyle, style: _style } =
        getPositionInfoFromOptions(props.options.position);

      const containerStyle: any = {
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        ..._containerStyle,
      };

      const style: any = {
        flexShrink: 0,
        width: formatToNativeSizeString(props.options.width),
        height: formatToNativeSizeString(props.options.height),
        transform: createTransformString(props.options.transform),
        filter: createFilterFromOptions(props.options.filter),
        zIndex: props.options.zIndex,
        background: props.options.backgroundColor?.color || "transparent",
        overflow: "hidden",
        boxSizing: "border-box",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ..._style,
      };

      onBeforeReturnRender({
        style,
        options: props.options,
      });

      return (
        <div style={containerStyle}>
          <div
            ref={targetRef}
            class="canvas-molecule-child"
            style={style}
            data-molecule-engine="rdkit"
          >
            <style>{`
                        .canvas-molecule-child svg {
                            width: 100%;
                            height: 100%;
                        }
                        .canvas-molecule-child__error {
                            color: #c45656;
                            font-size: 14px;
                            line-height: 1.4;
                            padding: 12px;
                            background: rgba(255, 245, 245, 0.92);
                            border: 1px solid rgba(196, 86, 86, 0.35);
                            border-radius: 4px;
                            max-width: 80%;
                            text-align: center;
                        }
                    `}</style>
            {errorMessage.value ? (
              <div class="canvas-molecule-child__error">
                {errorMessage.value}
              </div>
            ) : (
              <div innerHTML={svgHtml.value}></div>
            )}
          </div>
        </div>
      );
    };
  },
});
