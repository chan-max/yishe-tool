import { useLoginStatusStore } from "@/store/stores/user";
import { ElMessage } from 'element-plus'

export const tokenRequestInterceptor = (request) => {
    request.headers.token = useLoginStatusStore().token;
    return request
 }

 function ensureFormData(obj) {
    if (obj instanceof FormData) {
        return obj;
    } else if (obj instanceof Object) {
        const formData = new FormData();
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    }
    return new FormData()
}

 export const formDataFormatRequestInterceptor = (request) => {
    request.data = ensureFormData(request.data);
    return request
 }

 export const tokenResponseInterceptor = (response) => {
  response.headers.token && (useLoginStatusStore().token = response.headers.token);
  return response;
}

export const messageResponseInterceptor = (response) => {
    if(response.data.message && response.data.type){
        ElMessage({
            message: response.data.message,
            type: response.data.type,
          })
    }
    return response
}