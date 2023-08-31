import { useLoginStatusStore } from "@/store/stores/user";
import axios from "axios";

// 全局设置
axios.defaults.timeout = 100000; // 时间超时设置100s

const apiInstance = axios.create();

axios.interceptors.request.use = apiInstance.interceptors.request.use;

apiInstance.interceptors.request.use((request) => {
  request.headers.token = useLoginStatusStore().token;
  return request;
});

apiInstance.interceptors.response.use((response) => {

    // 保存 token
  response.headers.token && (useLoginStatusStore().token = response.headers.token);
  
  return response.data;
});

export default apiInstance;
