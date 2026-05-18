export type OperationParamType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "color"
  | "object"
  | "array";

export interface OperationParamOption {
  label: string;
  value: string | number;
}

export interface OperationParamDef {
  name: string;
  label: string;
  type: OperationParamType;
  required?: boolean;
  default?: any;
  description?: string;
  options?: OperationParamOption[];
  min?: number;
  max?: number;
  placeholder?: string;
}

export interface OperationResult {
  success: boolean;
  message: string;
  data?: any;
}

export interface OperationDef {
  id: string;
  name: string;
  description: string;
  group: string;
  params: OperationParamDef[];
  execute: (
    params: Record<string, any>,
    ctx: OperationContext,
  ) => Promise<OperationResult> | OperationResult;
}

export interface OperationContext {
  getCanvasSize(): { width: number; height: number; unit: string };
  setCanvasSize(width: number, height: number, unit?: string): void;

  getCanvasBackgroundColor(): string;
  setCanvasBackgroundColor(color: string): void;

  getCanvasChildren(): any[];
  findChildById(id: string): any | undefined;
  addCanvasChild(type: string, options?: Record<string, any>): string;
  removeCanvasChild(id: string): void;

  getChildProperty(id: string, propPath: string): any;
  setChildProperty(id: string, propPath: string, value: any): void;

  selectChild(id: string): void;

  getDesignState(): Record<string, any>;
  clearCanvas(): void;
}

export interface OperationListItem {
  id: string;
  name: string;
  description: string;
  group: string;
  params: OperationParamDef[];
}

export interface JsonSchemaProperty {
  type: string;
  description?: string;
  default?: any;
  enum?: (string | number)[];
  minimum?: number;
  maximum?: number;
}

export interface JsonSchema {
  type: "object";
  properties: Record<string, JsonSchemaProperty>;
  required: string[];
  additionalProperties?: boolean;
}

export interface OperationTool {
  name: string;
  description: string;
  input_schema: JsonSchema;
}

function paramTypeToJsonSchema(type: OperationParamType): string {
  switch (type) {
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "color":
      return "string";
    case "select":
      return "string";
    default:
      return "string";
  }
}

export function buildInputSchema(params: OperationParamDef[]): JsonSchema {
  const properties: Record<string, JsonSchemaProperty> = {};
  const required: string[] = [];

  for (const p of params) {
    const prop: JsonSchemaProperty = {
      type: paramTypeToJsonSchema(p.type),
    };

    if (p.description) prop.description = p.description;
    if (p.default !== undefined) prop.default = p.default;
    if (p.options && p.options.length > 0)
      prop.enum = p.options.map((o) => o.value);
    if (p.min !== undefined) prop.minimum = p.min;
    if (p.max !== undefined) prop.maximum = p.max;

    properties[p.name] = prop;
    if (p.required) required.push(p.name);
  }

  return { type: "object", properties, required };
}
