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

    let thumbnails = await Promise.all(
        screenshots.value.map(async (shot) => {
            const file = Utils.transform.base64ToPngFile(shot.base64);
            return await uploadToCOS({ file: file });
        })
    );

    const params = {
        ...form || {},
        thumbnail: cos,
        thumbnails,
        meta: {
            modelInfo,
        },
        uploaderId: loginStore.userInfo?.id,
    };

    await createCustomModelApi(params);
}