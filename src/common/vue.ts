import { isRef, isReactive, toRaw, unref } from 'vue'

export function deepUnref(value) {
  // 如果是 ref，解包并递归处理
  if (isRef(value)) {
    return deepUnref(unref(value))
  }
  
  // 如果是 reactive，转换为原始对象并递归处理
  if (isReactive(value)) {
    value = toRaw(value)
  }
  
  // 如果是数组，递归处理每个元素
  if (Array.isArray(value)) {
    return value.map(item => deepUnref(item))
  }
  
  // 如果是对象，递归处理每个属性
  if (typeof value === 'object' && value !== null) {
    const result = {}
    for (const key in value) {
      result[key] = deepUnref(value[key])
    }
    return result
  }
  
  // 返回基本类型值
  return value
}
