
import axios from "axios";
import { messageResponseInterceptor, tokenRequestInterceptor, tokenResponseInterceptor } from "./apiInterception";

// 全局设置
axios.defaults.timeout = 100000; // 时间超时设置100s

const apiInstance:any = axios.create();

apiInstance.interceptors.request.use(tokenRequestInterceptor);
apiInstance.interceptors.response.use(tokenResponseInterceptor);

apiInstance.interceptors.response.use(messageResponseInterceptor);


export default apiInstance;
