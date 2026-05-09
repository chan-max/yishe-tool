export type HtmlTemplateFieldType =
  | "text"
  | "textarea"
  | "number"
  | "color"
  | "image"
  | "font";

export type HtmlTemplateSource = "builtin" | "local" | "remote";

export interface HtmlTemplateFieldDefinition {
  key: string;
  label: string;
  type: HtmlTemplateFieldType;
  placeholder?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  rows?: number;
}

export interface HtmlTemplateMeta {
  id: string;
  name: string;
  category: string;
  description?: string;
  tags?: string[];
  source?: HtmlTemplateSource;
  sortOrder?: number;
}

export interface HtmlTemplateDefinition extends HtmlTemplateMeta {
  htmlContent: string;
  bindingFields: HtmlTemplateFieldDefinition[];
  defaultBindings?: Record<string, any>;
}
