export type OperationParamType = 'string' | 'number' | 'boolean' | 'select' | 'color'

export interface OperationParamOption {
  label: string
  value: string | number
}

export interface OperationParamDef {
  name: string
  label: string
  type: OperationParamType
  required?: boolean
  default?: any
  description?: string
  options?: OperationParamOption[]
  min?: number
  max?: number
  placeholder?: string
}

export interface OperationResult {
  success: boolean
  message: string
  data?: any
}

export interface OperationDef {
  id: string
  name: string
  description: string
  group: string
  params: OperationParamDef[]
  execute: (params: Record<string, any>, ctx: OperationContext) => Promise<OperationResult> | OperationResult
}

export interface OperationContext {
  getCanvasSize(): { width: number; height: number; unit: string }
  setCanvasSize(width: number, height: number, unit?: string): void

  getCanvasBackgroundColor(): string
  setCanvasBackgroundColor(color: string): void

  getCanvasChildren(): any[]
  findChildById(id: string): any | undefined
  addCanvasChild(type: string, options?: Record<string, any>): string
  removeCanvasChild(id: string): void

  getChildProperty(id: string, propPath: string): any
  setChildProperty(id: string, propPath: string, value: any): void

  selectChild(id: string): void

  getDesignState(): Record<string, any>
  clearCanvas(): void
}

export interface OperationListItem {
  id: string
  name: string
  description: string
  group: string
  params: OperationParamDef[]
}
