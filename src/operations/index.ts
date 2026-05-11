export type {
  OperationParamType,
  OperationParamDef,
  OperationResult,
  OperationDef,
  OperationContext,
  OperationListItem,
  OperationTool,
  JsonSchema,
  JsonSchemaProperty,
} from './types'

export { buildInputSchema } from './types'

export {
  registerOperation,
  getOperation,
  getAllOperations,
  getOperationList,
  getOperationsByGroup,
  getOperationGroups,
  getOperationTools,
  executeOperation,
  executeOperationByName,
} from './registry'

export { createDesignOperationContext } from './context'

export {
  buildOperationsPrompt,
  buildOperationTools,
  parseOperationCalls,
  stripOperationBlocks,
  formatOperationResult,
  extractAiResponseText,
} from './ai-bridge'

export {
  CANVAS_DESIGN_SCHEMA,
  CHILD_DEFAULT_FACTORIES,
  buildDirectDesignPrompt,
  parseDirectDesignResult,
  stripDesignBlocks,
  validateDesignData,
  applyDesignToCanvas,
} from './canvas-schema'

import './ops'
