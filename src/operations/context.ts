import type { OperationContext } from "./types";
import {
  canvasStickerOptions,
  canvasStickerOptionsOnlyChild,
  addCanvasChild as _addCanvasChild,
  removeCavnasChild as _removeCavnasChild,
  currentOperatingCanvasChildId,
  getCanvasChildTopZIndex,
} from "@/components/design/layout/canvas";

function getCanvasChild() {
  return canvasStickerOptions.value.children.find(
    (c: any) => c.type === "canvas",
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (current[keys[i]] === undefined || current[keys[i]] === null) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

export function createDesignOperationContext(): OperationContext {
  return {
    getCanvasSize() {
      const child = getCanvasChild() as any;
      if (!child) return { width: 2000, height: 2000, unit: "px" };
      return {
        width: child.width.value,
        height: child.height.value,
        unit: child.width.unit,
      };
    },

    setCanvasSize(width, height, unit) {
      const child = getCanvasChild() as any;
      if (!child) return;
      const finalUnit = unit || child.width.unit;
      child.width = { value: width, unit: finalUnit };
      child.height = { value: height, unit: finalUnit };
    },

    getCanvasBackgroundColor() {
      const child = getCanvasChild() as any;
      return child?.backgroundColor?.color || "rgba(0,0,0,0)";
    },

    setCanvasBackgroundColor(color) {
      const child = getCanvasChild() as any;
      if (!child) return;
      child.backgroundColor = { color };
    },

    getCanvasChildren() {
      return canvasStickerOptions.value.children || [];
    },

    findChildById(id) {
      return canvasStickerOptions.value.children.find((c: any) => c.id === id);
    },

    addCanvasChild(type, options = {}) {
      const childOptions = { type, ...options };
      _addCanvasChild(childOptions);
      const lastChild =
        canvasStickerOptions.value.children[
          canvasStickerOptions.value.children.length - 1
        ];
      return lastChild?.id || "";
    },

    removeCanvasChild(id) {
      _removeCavnasChild(id);
    },

    getChildProperty(id, propPath) {
      const child = canvasStickerOptions.value.children.find(
        (c: any) => c.id === id,
      );
      if (!child) return undefined;
      return getNestedValue(child, propPath);
    },

    setChildProperty(id, propPath, value) {
      const child = canvasStickerOptions.value.children.find(
        (c: any) => c.id === id,
      );
      if (!child) return;
      setNestedValue(child, propPath, value);
    },

    selectChild(id) {
      currentOperatingCanvasChildId.value = id;
    },

    getDesignState() {
      const children = canvasStickerOptions.value.children || [];
      return {
        canvasChildrenCount: children.length,
        children: children.map((c: any) => ({
          id: c.id,
          type: c.type,
          zIndex: c.zIndex,
        })),
      };
    },

    clearCanvas() {
      const canvasChild = getCanvasChild();
      if (!canvasChild) return;
      canvasStickerOptions.value.children = [canvasChild];
      currentOperatingCanvasChildId.value = canvasChild.id;
    },
  };
}
