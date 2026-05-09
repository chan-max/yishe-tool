import type { OperationDef, OperationListItem, OperationContext, OperationResult } from './types'

const operations = new Map<string, OperationDef>()

export function registerOperation(op: OperationDef) {
  if (operations.has(op.id)) {
    console.warn(`[operations] duplicate registration: "${op.id}"`)
  }
  operations.set(op.id, op)
}

export function getOperation(id: string): OperationDef | undefined {
  return operations.get(id)
}

export function getAllOperations(): OperationDef[] {
  return Array.from(operations.values())
}

export function getOperationList(): OperationListItem[] {
  return getAllOperations().map(({ id, name, description, group, params }) => ({
    id,
    name,
    description,
    group,
    params,
  }))
}

export function getOperationsByGroup(group: string): OperationDef[] {
  return getAllOperations().filter((op) => op.group === group)
}

export function getOperationGroups(): string[] {
  const groups = new Set(getAllOperations().map((op) => op.group))
  return Array.from(groups)
}

export async function executeOperation(
  id: string,
  params: Record<string, any>,
  ctx: OperationContext
): Promise<OperationResult> {
  const op = operations.get(id)
  if (!op) {
    return { success: false, message: `操作 "${id}" 不存在` }
  }

  const mergedParams: Record<string, any> = {}
  for (const def of op.params) {
    if (params[def.name] !== undefined) {
      mergedParams[def.name] = params[def.name]
    } else if (def.default !== undefined) {
      mergedParams[def.name] = def.default
    }
  }

  for (const def of op.params) {
    if (def.required && (mergedParams[def.name] === undefined || mergedParams[def.name] === '')) {
      return { success: false, message: `缺少必填参数: ${def.label}` }
    }
    if (def.type === 'number' && mergedParams[def.name] !== undefined) {
      mergedParams[def.name] = Number(mergedParams[def.name])
      if (isNaN(mergedParams[def.name])) {
        return { success: false, message: `参数 ${def.label} 必须为数字` }
      }
      if (def.min !== undefined && mergedParams[def.name] < def.min) {
        return { success: false, message: `参数 ${def.label} 不能小于 ${def.min}` }
      }
      if (def.max !== undefined && mergedParams[def.name] > def.max) {
        return { success: false, message: `参数 ${def.label} 不能大于 ${def.max}` }
      }
    }
  }

  try {
    return await op.execute(mergedParams, ctx)
  } catch (err: any) {
    return { success: false, message: `执行失败: ${err?.message || String(err)}` }
  }
}

export async function executeOperationByName(
  name: string,
  params: Record<string, any>,
  ctx: OperationContext
): Promise<OperationResult> {
  const ops = getAllOperations().filter((op) => op.name === name || op.id === name)
  if (ops.length === 0) {
    return { success: false, message: `未找到操作: "${name}"` }
  }
  return executeOperation(ops[0].id, params, ctx)
}
