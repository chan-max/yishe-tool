import { useLoginStatusStore } from "@/store/stores/user";
import { ElMessage } from 'element-plus'

export const tokenRequestInterceptor = (request) => {
    request.headers.token = useLoginStatusStore().token;
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