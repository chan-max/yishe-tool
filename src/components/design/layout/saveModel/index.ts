/*
 * @Author: chan-max jackieontheway666@gmail.com
 * @Date: 2025-05-20 06:50:38
 * @LastEditors: chan-max jackieontheway666@gmail.com
 * @LastEditTime: 2025-06-21 12:02:57
 * @FilePath: /1s/src/components/design/layout/saveModel/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { currentModelController, lastestScreenshot, screenshots } from "../../store";
import { createCustomModelApi, uploadToCOS } from "@/api";
import Utils from "@/common/utils";
import { useLoginStatusStore } from "@/store/stores/login";

export async function saveCustomModel(form) {
    const loginStore = useLoginStatusStore();

    // 上传本地贴纸 , 过滤出本地的贴纸
    let localDecals = currentModelController.value.decalControllers.filter(
        (decal) => decal.state.isLocalResource
    );

    // 只负责把贴纸上传即可
    if (localDecals.length) {
        // 提示存在未上传的贴纸
    }

    const thumbnail = currentModelController.value.getScreenShotFile();

    const cos = await uploadToCOS({ file: thumbnail });
 
    const modelInfo = await currentModelController.value.exportTo1stf();

    const params = {
        ...form || {},
        thumbnail: cos.url,
        meta: {
            modelInfo,
        },
        uploaderId: loginStore.userInfo?.id,
    };

    await createCustomModelApi(params);
}