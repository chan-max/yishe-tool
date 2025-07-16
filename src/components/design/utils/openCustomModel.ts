/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-07-16 07:58:50
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-07-16 08:15:40
 * @FilePath: /design-server/Users/jackie/workspace/1s/src/components/design/utils/openCustomModel.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { currentModelController, enterEditMode, selectedAngles } from '../store';

/**
 * 通用打开模型方法
 * @param itemOrMeta 传入模型对象（含 meta）或 meta 字段
 * @param options 可选项：是否进入编辑模式
 */
export async function openCustomModel(itemOrMeta: any, options: { editMode?: boolean, id?: string } = {}) {
  const meta = itemOrMeta?.meta || itemOrMeta;
  // 恢复角度
  if (meta && Array.isArray(meta.selectedAngles)) {
    selectedAngles.value = [...meta.selectedAngles];
  }
  // 进入编辑模式
  if (options.editMode && (itemOrMeta?.id || options.id)) {
    enterEditMode(itemOrMeta.id || options.id, itemOrMeta);
  }
  // 恢复模型信息
  if (meta?.modelInfo) {
    await currentModelController.value.useModelInfo(meta.modelInfo);
  }
} 